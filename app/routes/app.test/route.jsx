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
    await authenticate.admin(request);

    const formData = await request.formData();

    const intent = formData.get("intent");

    // DELETE REVIEW
    if (intent === "delete") {
        const id = Number(formData.get("id"));

        if (!Number.isInteger(id)) {
            return {
                type: "delete",
                success: false,
                error: "Invalid review ID",
            };
        }

        const review = await prisma.reviews.findUnique({
            where: { id },
        });

        if (!review) {
            return {
                type: "delete",
                success: false,
                error: "Review not found",
            };
        }

        await prisma.reviews.delete({
            where: { id },
        });

        return {
            type: "delete",
            success: true,
            message: "Review deleted successfully",
        };
    }

    // CREATE REVIEW
    const name = formData.get("name");
    const description = formData.get("description");
    const rating = Number(formData.get("rating"));

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
    const editFetcher = useFetcher();
    const deleteFetcher = useFetcher();
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
    const [deletingId, setDeletingId] = useState(null);
 

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

    //handel delete with confermation
    const handleDelete = (id) => {
        setDeletingId(id);

        const modal = document.getElementById(
            "delete-review-modal"
        );

        modal?.showOverlay();
    };

    //handle delete response
    useEffect(() => {
        if (
            deleteFetcher.state === "idle" &&
            deleteFetcher.data?.type === "delete"
        ) {
            if (deleteFetcher.data.success) {
                shopify.toast.show(
                    deleteFetcher.data.message
                );

                const modal =
                    document.getElementById(
                        "delete-review-modal"
                    );

                modal?.hideOverlay();

                setDeletingId(null);
            }

            if (deleteFetcher.data.error) {
                shopify.toast.show(
                    deleteFetcher.data.error,
                    {
                        isError: true,
                    }
                );
            }
        }
    }, [deleteFetcher.data, deleteFetcher.state]);

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
                                            <s-button
                                                icon="delete"
                                                tone="critical"
                                                onClick={() => handleDelete(review.id)}
                                                >Delete</s-button>
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
                        id="edit-review-form"
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
                        </editFetcher.Form>
                    )}

                    <s-button
                        slot="secondary-actions"
                        commandFor="edit-review-modal"
                        command="--hide"
                    >
                        Cancel
                    </s-button>

                    <s-button
                        slot="primary-action"
                        variant="primary"
                        loading={editFetcher.state === "submitting"}
                        onClick={() => {
                            const form = document.getElementById("edit-review-form");

                            if (!form || !editingId) return;

                            editFetcher.submit(form, {
                                method: "post",
                                action: `/app/test/${editingId}/edit`,
                            });
                        }}
                    >
                        Update Review
                    </s-button>
                </s-modal>

                {/* Delete model */}
                <s-modal
                    id="delete-review-modal"
                    heading="Delete review?"
                >
                    <s-stack gap="base">
                        <s-paragraph>
                            Are you sure you want to delete this review?
                            This action cannot be undone.
                        </s-paragraph>
                    </s-stack>

                    <s-button
                        slot="secondary-actions"
                        commandFor="delete-review-modal"
                        command="--hide"
                        onClick={() => setDeletingId(null)}
                    >
                        Cancel
                    </s-button>

                    <s-button
                        slot="primary-action"
                        variant="primary"
                        tone="critical"
                        loading={deleteFetcher.state === "submitting"}
                        onClick={() => {
                            if (!deletingId) return;

                            deleteFetcher.submit(
                                {
                                    intent: "delete",
                                    id: String(deletingId),
                                },
                                {
                                    method: "post",
                                }
                            );
                        }}
                    >
                        Delete review
                    </s-button>
                </s-modal>
            </s-page>
        </s-box>
    );
}
