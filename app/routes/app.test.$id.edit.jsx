
import prisma from "../db.server";
import { authenticate } from "../shopify.server";

export async function loader({ request, params }) {
    await authenticate.admin(request);
    console.log('1111111111');
    const id = Number(params.id);

    if (!Number.isInteger(id)) {
        throw new Response('Invalid review ID', {status: 400});
    }

    const review = await prisma.reviews.findUnique({
        where: {
            id: id,
        },
    });

    if (!review) {
        throw new Response("Review not found", {
            status: 404,
        });
    }

    console.log(review);
    
    return review;
}
