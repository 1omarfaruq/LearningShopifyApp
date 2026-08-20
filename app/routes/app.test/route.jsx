import { Form, useActionData } from "react-router";

export async function action({ request }) {
    const formData = await request.formData();

    const name = formData.get("name");
    const description = formData.get("description");
    const rating = formData.get("rating");

    console.log("Name:", name);
    console.log("Description:", description);
    console.log("Rating:", rating);

    return {
        success: true,
        message: "Review submitted successfully ",
    };
}

export default function TestPage() {
    const actionData = useActionData();

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
                                    label="Name a"
                                    name="name"
                                    required
                                ></s-text-field>

                                <s-text-area
                                    label="Description"
                                    name="description"
                                    rows="4"
                                ></s-text-area>

                                <s-text-field
                                    label="Rating"
                                    name="rating"
                                    required
                                ></s-text-field>

                            </s-stack>
                        </Form>
                    </div>
                </s-section>

                {actionData?.success && (
                    <s-banner tone="success">
                        {actionData.message}
                    </s-banner>
                )}

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