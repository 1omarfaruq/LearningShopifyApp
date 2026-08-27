
import prisma from "../db.server";
import { authenticate } from "../shopify.server";

export async function loader({ request, params }) {
    await authenticate.admin(request);

    const id = Number(params.id);

    if (!Number.isInteger(id)) {
        return {
            type: "error",
            error: "Invalid review ID",
        };
    }

    const review = await prisma.reviews.findUnique({
        where: {
            id,
        },
    });

    if (!review) {
        return {
            type: "error",
            error: "Review not found",
        };
    }

    return {
        type: "load",
        review,
    };
}

export async function action({ request, params }) {
    await authenticate.admin(request);

    const id = Number(params.id);

    if (!Number.isInteger(id)) {
        return {
            type: "update",
            success: false,
            error: "Invalid review ID",
        };
    }

    const formData = await request.formData();

    const name = String(formData.get("name") || "").trim();
    const description = String(
        formData.get("description") || ""
    ).trim();

    const rating = Number(formData.get("rating"));

    if (!name) {
        return {
            type: "update",
            success: false,
            error: "Name is required",
        };
    }

    if (
        !Number.isInteger(rating) ||
        rating < 0 ||
        rating > 5
    ) {
        return {
            type: "update",
            success: false,
            error: "Rating must be between 0 and 5",
        };
    }

    const review = await prisma.reviews.update({
        where: {
            id,
        },
        data: {
            name,
            description: description || null,
            Rating: rating,
        },
    });

    return {
        type: "update",
        success: true,
        message: "Review updated successfully",
        review,
    };
}