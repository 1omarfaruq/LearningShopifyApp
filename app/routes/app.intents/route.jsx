import { useLoaderData, useLocation, useNavigate, useRevalidator } from "react-router";
import { authenticate } from "../../shopify.server";

export async function loader({ request }) {
  const { admin } = await authenticate.admin(request);

  const response = await admin.graphql(`
    #graphql
    query GetProducts {
      products(first: 15) {
        edges {
          cursor
          node {
            id
            title
            status
            totalInventory
            vendor

            featuredMedia {
              preview {
                image {
                  url
                  altText
                }
              }
            }
          }
        }
      }
    }
  `);

  const json = await response.json();

  const edges = json.data.products.edges;

  return {
    edges,
  };
}

export default function IntentsPages() {
  const { edges } = useLoaderData();

  const navigate = useNavigate();
  const location = useLocation();
  const revalidator = useRevalidator();

  const pageSize = 10;

  const currentPage = Number(
    new URLSearchParams(location.search).get("page") || 1
  );

  const totalPages = Math.ceil(edges.length / pageSize);

  const startIndex = (currentPage - 1) * pageSize;

  const currentEdges = edges.slice(
    startIndex,
    startIndex + pageSize
  );

  const products = currentEdges.map((edge) => edge.node);

  const handlePageClick = (page) => {
    if (page === currentPage) return;

    navigate(`?page=${page}`);
  };

  const handlePrevious = () => {
    if (currentPage <= 1) return;

    navigate(`?page=${currentPage - 1}`);
  };

  const handleNext = () => {
    if (currentPage >= totalPages) return;

    navigate(`?page=${currentPage + 1}`);
  };

  const handleCreateProduct = async () => {
    try {
        const activity = await shopify.intents.invoke(
        "create:shopify/Product"
        );

        const response = await activity.complete;

        if (response.code === "ok") {
        console.log("Product created:", response.data);

        // Reload only this route's loader
        revalidator.revalidate();
        } else if (response.code === "closed") {
        console.log("Product creation cancelled");
        } else if (response.code === "error") {
        console.error(
            "Product creation error:",
            response.message
        );
        }
    } catch (error) {
        console.error(
        "Failed to open product creation intent:",
        error
        );
    }
    };

  return (
    <>
    <s-box>
        <s-page>
            <s-stack direction="inline" justifyContent="space-between" alignItems="center">
                <s-stack direction="inline" gap="small" alignItems="center">
                    <h2>Products List</h2>

                    <s-tooltip id="auto-publish-tooltip">This order has active shipping labels.</s-tooltip>
                    
                    <style>
                        {`
                            .live-bullate {
                                display: inline-block;
                                width: 8px;
                                height: 8px;
                                background: #039835;
                                border-radius: 50%;
                            }
                        `}
                    </style>
                </s-stack>
                <s-stack direction="inline" gap="small">
                    <s-button href="javascript:void(0)">Import</s-button>
                    <s-button  onClick={handleCreateProduct}>Create Product</s-button>
                </s-stack>
            </s-stack>
        
            <s-table>
                <s-table-header-row>
                <s-table-header>SL</s-table-header>
                <s-table-header>Product</s-table-header>
                <s-table-header>Status</s-table-header>
                <s-table-header>Inventory</s-table-header>
                <s-table-header>Vendor</s-table-header>
                </s-table-header-row>

                <s-table-body>
                {products.map((product, index) => {
                    const image =
                    product.featuredMedia?.preview?.image;

                    const serialNumber =
                    (currentPage - 1) * pageSize +
                    index +
                    1;

                    return (
                    <s-table-row key={product.id}>
                        {/* Serial */}
                        <s-table-cell>
                        {serialNumber}
                        </s-table-cell>

                        {/* Product */}
                        <s-table-cell>
                        <div
                            style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            }}
                        >
                            {image ? (
                            <img
                                src={image.url}
                                alt={
                                image.altText ||
                                product.title
                                }
                                width="50"
                                height="50"
                                style={{
                                width: "50px",
                                height: "50px",
                                objectFit: "cover",
                                borderRadius: "6px",
                                }}
                            />
                            ) : (
                            <div
                                style={{
                                width: "50px",
                                height: "50px",
                                background: "#eee",
                                borderRadius: "6px",
                                }}
                            />
                            )}

                            <span>
                            {product.title}
                            </span>
                        </div>
                        </s-table-cell>

                        {/* Status */}
                        <s-table-cell>
                        {product.status}
                        </s-table-cell>

                        {/* Inventory */}
                        <s-table-cell>
                        {product.totalInventory}
                        </s-table-cell>

                        {/* Vendor */}
                        <s-table-cell>
                        {product.vendor || "-"}
                        </s-table-cell>
                    </s-table-row>
                    );
                })}
                </s-table-body>
            </s-table>

            {/* Pagination */}
            {totalPages > 1 && (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "8px",
                        marginTop: "20px",
                        marginBottom: "20px",
                    }}
                >
                    {/* Previous */}
                    <button
                        onClick={handlePrevious}
                        disabled={currentPage === 1}
                        style={{
                        padding: "8px 14px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                        cursor:
                            currentPage === 1
                            ? "not-allowed"
                            : "pointer",
                        opacity:
                            currentPage === 1
                            ? 0.5
                            : 1,
                        }}
                    >
                        Previous
                    </button>

                    {/* Page Numbers */}
                    {Array.from(
                        { length: totalPages },
                        (_, index) => index + 1
                    ).map((page) => (
                        <button
                        key={page}
                        onClick={() =>
                            handlePageClick(page)
                        }
                        style={{
                            padding: "8px 12px",
                            borderRadius: "6px",
                            border: "1px solid #ccc",
                            fontWeight:
                            currentPage === page
                                ? "600"
                                : "400",
                            background:
                            currentPage === page
                                ? "#111"
                                : "#fff",
                            color:
                            currentPage === page
                                ? "#fff"
                                : "#111",
                            cursor: "pointer",
                        }}
                        >
                        {page}
                        </button>
                    ))}

                    {/* Next */}
                    <button
                        onClick={handleNext}
                        disabled={
                        currentPage === totalPages
                        }
                        style={{
                        padding: "8px 14px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                        cursor:
                            currentPage === totalPages
                            ? "not-allowed"
                            : "pointer",
                        opacity:
                            currentPage === totalPages
                            ? 0.5
                            : 1,
                        }}
                    >
                        Next
                    </button>
                </div>
            )}
        </s-page>
    </s-box>
    </>
  );
}