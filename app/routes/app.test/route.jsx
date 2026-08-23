import { useEffect, useRef } from "react";
import { Form, useActionData } from "react-router";
import prisma from "../../db.server";
import { authenticate } from "../../shopify.server";

export async function action({ request }) {
    const { admin } = await authenticate.admin(request);
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

    const review = await prisma.reviews.create({
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
    const nameRef = useRef(null);
    const descriptionRef = useRef(null);
    const ratingRef = useRef(null);
    
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
            </s-page>
        </s-box>
    );
}