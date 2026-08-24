
import { useLoaderData } from "react-router";
import prisma from "../db.server";
import { authenticate } from "../shopify.server";

export async function loader({ request, params }) {
    await authenticate.admin(request);

    const id = Number(params.id);

    const review = await prisma.reviews.findUnique({
        where: {
            id: id,
        },
    });

    return {
        review,
    };
}

export default function EditReviews() {
    const { review } = useLoaderData();

    return (
        <s-page heading="Edit Review">
            <s-section>

                <p>ID: {review.id}</p>
                <p>Name: {review.name}</p>
                <p>Description: {review.description}</p>
                <p>Rating: {review.Rating}</p>

            </s-section>
        </s-page>
    );
}