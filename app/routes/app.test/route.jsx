import { useEffect, useRef, useState } from "react";
import { Form, useActionData, useFetcher, useLoaderData, useNavigate } from "react-router";
import prisma from "../../db.server";
import { authenticate } from "../../shopify.server";

export async function loader({ request }) {
    await authenticate.admin(request);

    const url = new URL(request.url);

    const sort = url.searchParams.get("sort") || "id";
    const direction =
        url.searchParams.get("direction") || "desc";

    const allowedSortFields = [
        "id",
        "name",
        "description",
        "Rating"
    ];

    const sortField = allowedSortFields.includes(sort)
        ? sort
        : "id";

    const sortDirection =
        direction === "asc"
            ? "asc"
            : "desc";

    const reviews = await prisma.reviews.findMany({
        orderBy: {
            [sortField]: sortDirection,
        },
    });

    return {
        reviews,
        sort: sortField,
        direction: sortDirection,
    };
}

export async function action({ request }) {
    const formData = await request.formData();
    const name = formData.get("name");
    const description = formData.get("description");
    const rating = Number(formData.get("rating"));

    // Rating validation
    if (
        !Number.isInteger(rating) ||
        rating < 0 ||
        rating > 5
    ) {
        return {
            success: false,
            error: "Rating must be between 0 and 5",
        };
    }

    await prisma.reviews.create({
        data: {
            name: String(name),
            description: description
                ? String(description)
                : null,
            Rating: rating,
        },
    });

    return {
        success: true,
        message: "Review submitted successfully",
    };
}

export default function TestPage() {
    const actionData = useActionData();
    const editFetcher = useFetcher()
    const {
        reviews,
        sort,
        direction
    } = useLoaderData();
    const navigate = useNavigate();

    //Create form fields references
    const nameRef = useRef(null);
    const descriptionRef = useRef(null);
    const ratingRef = useRef(null);

    //Edit modal form references
    const editNameRef = useRef(null);
    const editDescriptionRef = useRef(null);
    const editRatingRef = useRef(null);
    const [editingId, setEditingId] = useState(null);
 

    useEffect(() => {
        if (actionData?.success) {
            shopify.toast.show(actionData.message);

            if (nameRef.current) {
                nameRef.current.value = "";
            }

            if (descriptionRef.current) {
                descriptionRef.current.value = "";
            }

            if (ratingRef.current) {
                ratingRef.current.value = "";
            }
        }

        if (actionData?.error) {
            shopify.toast.show(actionData.error, {
                isError: true,
            });
        }
    }, [actionData]);

    const handleSort = (column) => {

        const newDirection =
            sort === column && direction === "asc"
                ? "desc"
                : "asc";

        navigate(
            `?sort=${column}&direction=${newDirection}`
        );
    };

    const handleEdit = (id)=> {
        setEditingId(id);

        editFetcher.load(`/app/test/${id}/edit`);
    }

    //Fetch reviews for modal and open modal
    useEffect(() => {
        if (
            editFetcher.state === "idle" &&
            editFetcher.data?.type === "load" &&
            editFetcher.data?.review
        ) {
            const review = editFetcher.data.review;

            if (editNameRef.current) {
                editNameRef.current.value =
                    review.name || "";
            }

            if (editDescriptionRef.current) {
                editDescriptionRef.current.value =
                    review.description || "";
            }

            if (editRatingRef.current) {
                editRatingRef.current.value =
                    String(review.Rating ?? "");
            }

            const modal =
                document.getElementById(
                    "edit-review-modal"
                );

            modal?.showOverlay();
        }
    }, [editFetcher.data, editFetcher.state]);

    //update response handle
    useEffect(() => {
        if (
            editFetcher.state === "idle" &&
            editFetcher.data?.type === "update"
        ) {
            if (editFetcher.data.success) {
                shopify.toast.show(
                    editFetcher.data.message
                );

                const modal =
                    document.getElementById(
                        "edit-review-modal"
                    );

                modal?.hideOverlay();

                setEditingId(null);
            }

            if (editFetcher.data.error) {
                shopify.toast.show(
                    editFetcher.data.error,
                    {
                        isError: true,
                    }
                );
            }
        }
    }, [editFetcher.data, editFetcher.state]);

    return (
        <s-box padding="small">
            <s-page>
                <s-section heading="Give Review">
                    <s-divider></s-divider>

                    <div className="review-form-wrapper">
                        <Form
                            method="post"
                            data-save-bar
                            data-discard-confirmation
                        >
                            <s-stack gap="small">

                                <s-text-field
                                    ref={nameRef}
                                    label="Name a"
                                    name="name"
                                    required
                                ></s-text-field>

                                <s-text-area
                                    ref={descriptionRef}
                                    label="Description"
                                    name="description"
                                    rows="4"
                                ></s-text-area>

                                <s-number-field
                                    ref={ratingRef}
                                    label="Rating"
                                    name="rating"
                                    min="0"
                                    max="5"
                                    required
                                ></s-number-field>

                            </s-stack>
                        </Form>
                    </div>
                </s-section>

                <style>
                    {`
                        .review-form-wrapper {
                            width: 60%;
                            margin: 0 auto;
                        }
                    `}
                </style>

                <s-section heading="Review List">
                    <s-table>
                        <s-table-header-row>
                            <s-table-header>
                                <s-stack direction="inline" justifyContent="space-between" alignItems="center">
                                    ID 
                                    <s-button icon="sort" variant="tertiary" onClick={() => handleSort("id")}></s-button>
                                </s-stack>
                            </s-table-header>

                            <s-table-header>
                                Name
                            </s-table-header>

                            <s-table-header>
                                Description
                            </s-table-header>

                            <s-table-header>
                                Rating
                            </s-table-header>

                            <s-table-header>
                                Action
                            </s-table-header>
                        </s-table-header-row>

                        <s-table-body>
                            {reviews.map((review) => (
                                <s-table-row key={review.id}>

                                    <s-table-cell>
                                        {review.id}
                                    </s-table-cell>

                                    <s-table-cell>
                                        {review.name}
                                    </s-table-cell>

                                    <s-table-cell>
                                        {review.description || "-"}
                                    </s-table-cell>

                                    <s-table-cell>
                                        {review.Rating}
                                    </s-table-cell>

                                    <s-table-cell>
                                        <s-button
                                            icon="menu-horizontal"
                                            variant="tertiary"
                                            accessibilityLabel="More actions"
                                            commandFor={`row-actions-${review.id}`}
                                        ></s-button>

                                        <s-menu id={`row-actions-${review.id}`} accessibilityLabel="More actions">
                                            <s-button
                                                icon="edit"
                                                loading={editFetcher.state === "loading" && editingId === review.id}
                                                onClick={()=>handleEdit(review.id)}>
                                                    Edit
                                            </s-button>
                                            <s-button icon="duplicate">Duplicate</s-button>
                                            <s-button icon="archive">Archive</s-button>
                                            <s-button icon="delete" tone="critical">Delete</s-button>
                                        </s-menu>
                                    </s-table-cell>
                                </s-table-row>
                            ))}
                        </s-table-body>
                    </s-table>
                </s-section>

                <s-modal
                    id="edit-review-modal"
                    heading="Edit Review"
                >
                    {editingId && (
                        <editFetcher.Form
                            method="post"
                            action={`/app/test/${editingId}/edit`}
                        >
                            <s-stack gap="base">

                                <s-text-field
                                    ref={editNameRef}
                                    label="Name"
                                    name="name"
                                ></s-text-field>

                                <s-text-area
                                    ref={editDescriptionRef}
                                    label="Description"
                                    name="description"
                                    rows="4"
                                ></s-text-area>

                                <s-number-field
                                    ref={editRatingRef}
                                    label="Rating"
                                    name="rating"
                                    min="0"
                                    max="5"
                                ></s-number-field>

                            </s-stack>
                            <s-box padding="small"></s-box>
                            <s-button
                                slot="secondary-actions"
                                commandFor="edit-review-modal"
                                command="--hide"
                                style={{ marginRight: "12px" }}
                            >
                                Cancel
                            </s-button>

                            <s-button
                                type="submit"
                                slot="primary-action"
                                variant="primary"
                                loading={editFetcher.state === "submitting"}
                            >
                                Update Review
                            </s-button>
                        </editFetcher.Form>
                    )}
                </s-modal>
            </s-page>
        </s-box>
    );
}
