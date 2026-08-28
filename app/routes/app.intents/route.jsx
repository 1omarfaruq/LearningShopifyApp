import { useState } from "react";
import { useLoaderData, useLocation, useNavigate } from "react-router";
import { authenticate } from "../../shopify.server";

export async function loader({ request }) {
  const { admin } = await authenticate.admin(request);

  const url = new URL(request.url);

  const after = url.searchParams.get("after");
  const before = url.searchParams.get("before");

  let queryVariables;

  if (before) {
    queryVariables = {
      first: null,
      last: 5,
      after: null,
      before,
    };
  } else {
    queryVariables = {
      first: 5,
      last: null,
      after: after || null,
      before: null,
    };
  }

  const response = await admin.graphql(
    `#graphql
    query GetProducts(
      $first: Int
      $last: Int
      $after: String
      $before: String
    ) {

      products(
        first: $first
        last: $last
        after: $after
        before: $before
      ) {

        nodes {
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

        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }
    `,
    {
      variables: queryVariables,
    }
  );

  const json = await response.json();

  return {
    products: json.data.products.nodes,
    pageInfo: json.data.products.pageInfo,
  };
}

export default function IntentsPages(){
    const { products, pageInfo } = useLoaderData();
    const navigate = useNavigate();
    const location = useLocation();

    const currentPage = Number(
        new URLSearchParams(location.search).get("page") || 1
    );

    const [pageCursors, setPageCursors] = useState({
        1: null,
    });

    const handleNext = () => {
        if (!pageInfo.hasNextPage) return;

        const nextPage = currentPage + 1;

        setPageCursors((prev) => ({
            ...prev,
            [nextPage]: pageInfo.endCursor,
        }));

        navigate(
            `?page=${nextPage}&after=${encodeURIComponent(
            pageInfo.endCursor
            )}`
        );
    };

    const handlePrevious = () => {
        if (!pageInfo.hasPreviousPage) return;

        const previousPage = currentPage - 1;

        navigate(
            `?page=${previousPage}&before=${encodeURIComponent(
            pageInfo.startCursor
            )}`
        );
    };

    const handlePageClick = (page) => {
        if (page === currentPage) return;

        if (page === 1) {
            navigate("?page=1");
            return;
        }

        const cursor = pageCursors[page];

        if (!cursor) return;

        navigate(
            `?page=${page}&after=${encodeURIComponent(cursor)}`
        );
    };
    return <>
        <s-box padding="small">
            <s-page>
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
                            const image = product.featuredMedia?.preview?.image;
                            const serialNumber = (currentPage - 1) * 5 + index + 1;

                            return (
                            <s-table-row key={product.id}>
                                <s-table-cell>
                                    {serialNumber}
                                </s-table-cell>
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
                                        alt={image.altText || product.title}
                                        width="50"
                                        height="50"
                                        style={{
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

                                    <span>{product.title}</span>
                                </div>
                                </s-table-cell>

                                <s-table-cell>
                                {product.status}
                                </s-table-cell>

                                <s-table-cell>
                                {product.totalInventory}
                                </s-table-cell>

                                <s-table-cell>
                                {product.vendor || "-"}
                                </s-table-cell>

                            </s-table-row>
                            );
                        })}

                        </s-table-body>
                </s-table>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "8px",
                        marginTop: "20px",
                    }}
                    >
                    <button
                        onClick={handlePrevious}
                        disabled={!pageInfo.hasPreviousPage}
                    >
                        Previous
                    </button>

                    {[1, 2, 3].map((page) => (
                        <button
                        key={page}
                        onClick={() => handlePageClick(page)}
                        style={{
                            padding: "8px 12px",
                            borderRadius: "6px",
                            border: "1px solid #ccc",
                            fontWeight: currentPage === page ? "600" : "400",
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

                    <button
                        onClick={handleNext}
                        disabled={!pageInfo.hasNextPage}
                    >
                        Next
                    </button>
                    </div>
            </s-page>
        </s-box>
    </>;
}