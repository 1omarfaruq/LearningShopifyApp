import { useEffect, useRef } from "react";
import { Form, useActionData } from "react-router";
import prisma from "../../db.server";
import { authenticate } from "../../shopify.server";

export async function action({ request }) {
    const {admin} = await authenticate.admin(request);
    const formData = await request.formData();

    const name = formData.get("name");
    const description = formData.get("description");
    const rating = formData.get("rating");

    console.log("Name:", name);
    console.log("Description:", description);
    console.log("Rating:", rating);

    const review = await prisma.reviews.create({
        data: {
            name: String(name),
            description: description
                ? String(description)
                : null,
            Rating: Number(rating),
        },
    });

    console.log("Created review:", review);

    return {
        success: true,
        message: "Review submitted successfully",
    };
}

export default function TestPage() {
    const actionData = useActionData();
    const formRef = useRef(null);
    
    useEffect(() => {
        if (actionData?.success) {
            shopify.toast.show(actionData.message);
            formRef.current?.reset();
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
                            ref={formRef}
                        >
                            <s-stack gap="small">

                                <s-text-field
                                    label="Name a"
                                    name="name"
                                    required
                                ></s-text-field>

                                <s-text-area
                                    label="Description"
                                    name="description"
                                    rows="4"
                                ></s-text-area>

                                <s-number-field
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