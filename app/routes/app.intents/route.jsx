import { useEffect, useState } from "react";
import {
  useFetcher,
  useLoaderData,
  useLocation,
  useNavigate,
  useRevalidator,
} from "react-router";
import { authenticate } from "../../shopify.server";

export async function loader({ request }) {
  const { admin } = await authenticate.admin(request);

  const url = new URL(request.url);
  const after = url.searchParams.get("after");
  const before = url.searchParams.get("before");
  const pageSize = 5;

  const isPrevious = Boolean(before);

  const variables = isPrevious
    ? {
        first: null,
        after: null,
        last: pageSize,
        before,
      }
    : {
        first: pageSize,
        after,
        last: null,
        before: null,
      };

  const response = await admin.graphql(
    `#graphql
      query GetProducts(
        $first: Int
        $after: String
        $last: Int
        $before: String
      ) {
        products(
          first: $first
          after: $after
          last: $last
          before: $before
        ) {
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
          pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
          }
        }
      }
    `,
    { variables }
  );

  const json = await response.json();
  const productsData = json.data.products;

  return {
    edges: productsData.edges,
    pageInfo: productsData.pageInfo,
  };
}

export async function action({ request }) {
  const { admin } = await authenticate.admin(request);

  const formData = await request.formData();

  const intent = formData.get("intent");
  const productId = formData.get("productId");

  if (intent !== "delete-product") {
    return {
      success: false,
      message: "Invalid action",
    };
  }

  const response = await admin.graphql(
    `#graphql
    mutation DeleteProduct($input: ProductDeleteInput!) {
      productDelete(input: $input) {
        deletedProductId
        userErrors {
          field
          message
        }
      }
    }`,
    {
      variables: {
        input: {
          id: productId,
        },
      },
    }
  );

  const json = await response.json();

  const result = json.data.productDelete;

  if (result.userErrors.length > 0) {
    return {
      success: false,
      errors: result.userErrors,
    };
  }

  return {
    success: true,
    deletedProductId: result.deletedProductId,
  };
}

export default function IntentsPages() {
  const { edges, pageInfo } = useLoaderData();

  const navigate = useNavigate();
  const location = useLocation();
  const revalidator = useRevalidator();
  const fetcher = useFetcher();
  const [ deleteProduct, setDeleteProduct ] = useState(null);

  const pageSize = 10;

  const currentPage = Number(
    new URLSearchParams(location.search).get("page") || 1
  );

  const products = edges.map((edge) => edge.node);

  const handlePrevious = () => {
    if (!pageInfo.hasPreviousPage) return;

    const params = new URLSearchParams();

    params.set("before", pageInfo.startCursor);
    params.set("page", Math.max(currentPage - 1, 1));

    navigate(`?${params.toString()}`);
  };

  const handleNext = () => {
    if (!pageInfo.hasNextPage) return;

    const params = new URLSearchParams();

    params.set("after", pageInfo.endCursor);
    params.set("page", currentPage + 1);

    navigate(`?${params.toString()}`);
  };

  const handleCreateProduct = async () => {
    try {
      const activity = await shopify.intents.invoke(
        "create:shopify/Product"
      );

      const response = await activity.complete;

      if (response.code === "ok") {
        console.log("Product created:", response.data);
        revalidator.revalidate();
      } else if (response.code === "closed") {
        console.log("Product creation cancelled");
      } else if (response.code === "error") {
        console.error("Product creation error:", response.message);
      }
    } catch (error) {
      console.error(
        "Failed to open product creation intent:",
        error
      );
    }
  };

  const handleEditProduct = async (productId) => {
    try {
        console.log("products iddddddddddddddddd", productId);
        const activity = await shopify.intents.invoke('edit:shopify/Product', {
        value: productId,
        });

        const response = await activity.complete;

        if (response.code === 'ok') {
            console.log('Product updated:', response.data);
            revalidator.revalidate();
        } else if (response.code === 'closed') {
            console.log('Edit cancelled by user');
        } else if (response.code === 'error') {
            console.log('Error:', response.message);
        }
    } catch (error) {
        console.error(
        "Failed to open product creation intent:",
        error
      );
    }
  }

  const handleDeleteProduct = (product) => {
    setDeleteProduct(product);

    setTimeout(() => {
      shopify.modal.show("delete-product-modal");
    }, 0);
  };

  useEffect(() => {
  if (!fetcher.data) return;

  if (fetcher.data.success) {
    shopify.toast.show(
      "Product deleted successfully"
    );

    shopify.modal.hide(
      "delete-product-modal"
    );

    setDeleteProduct(null);

    revalidator.revalidate();
  } else {
    shopify.toast.show(
      "Failed to delete product"
    );
  }
}, [fetcher.data]);

  return (
    <>
      <s-box>
        <s-page>
          <s-stack
            direction="inline"
            justifyContent="space-between"
            alignItems="center"
          >
            <s-stack direction="inline" gap="small" alignItems="center">
              <h2>Products List</h2>

              <s-tooltip id="auto-publish-tooltip">
                This order has active shipping labels.
              </s-tooltip>

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
              <s-button onClick={handleCreateProduct}>
                Create Product
              </s-button>
            </s-stack>
          </s-stack>

          <s-table>
            <s-table-header-row>
              <s-table-header>SL</s-table-header>
              <s-table-header>Product</s-table-header>
              <s-table-header>Status</s-table-header>
              <s-table-header>Inventory</s-table-header>
              <s-table-header>Vendor</s-table-header>
              <s-table-header>Action</s-table-header>
            </s-table-header-row>

            <s-table-body>
              {products.map((product, index) => {
                const image = product.featuredMedia?.preview?.image;

                const serialNumber =
                  (currentPage - 1) * pageSize + index + 1;

                  console.log('1111111111111111111' , product);
                return (
                  <s-table-row key={product.id}>
                    <s-table-cell>{serialNumber}</s-table-cell>
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

                        <span>{product.title}</span>
                      </div>
                    </s-table-cell>

                    <s-table-cell>{product.status}</s-table-cell>
                    <s-table-cell>{product.totalInventory}</s-table-cell>
                    <s-table-cell>{product.vendor || "-"}</s-table-cell>
                    <s-table-cell>
                        <s-button
                            icon="menu-horizontal"
                            variant="tertiary"
                            accessibilityLabel="More actions"
                            commandFor={`row-actions-${product.id}`}
                        ></s-button>

                        <s-menu id={`row-actions-${product.id}`} accessibilityLabel="More actions">
                            <s-button icon="edit" onClick={() => handleEditProduct(product.id)}>Edit product</s-button>
                            <s-button icon="duplicate">Duplicate product</s-button>
                            <s-button icon="archive">Archive product</s-button>
                            <s-button icon="delete" tone="critical" onClick={() => handleDeleteProduct(product)}>Delete product</s-button>
                        </s-menu>
                    </s-table-cell>
                  </s-table-row>
                );
              })}
            </s-table-body>
          </s-table>

          {/* Server-side Pagination */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "12px",
              marginTop: "20px",
              marginBottom: "20px",
            }}
          >
            <button
              onClick={handlePrevious}
              disabled={!pageInfo.hasPreviousPage}
              style={{
                padding: "8px 14px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                cursor: !pageInfo.hasPreviousPage
                  ? "not-allowed"
                  : "pointer",
                opacity: !pageInfo.hasPreviousPage ? 0.5 : 1,
              }}
            >
              Previous
            </button>

            <span
              style={{
                padding: "8px 14px",
                borderRadius: "6px",
                background: "#111",
                color: "#fff",
                fontWeight: "600",
              }}
            >
              Page {currentPage}
            </span>

            <button
              onClick={handleNext}
              disabled={!pageInfo.hasNextPage}
              style={{
                padding: "8px 14px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                cursor: !pageInfo.hasNextPage
                  ? "not-allowed"
                  : "pointer",
                opacity: !pageInfo.hasNextPage ? 0.5 : 1,
              }}
            >
              Next
            </button>
          </div>

          
          <s-modal
            id="delete-product-modal"
            heading="Delete product?"
          >
            <s-stack gap="base">
              <s-text>
                Are you sure you want to delete 
                "{deleteProduct?.title || "this product"}"?
              </s-text>

              <s-text tone="caution">
                This action cannot be undone.
              </s-text>
            </s-stack>

            <s-button
              slot="secondary-actions"
              variant="secondary"
              onClick={() => {
                setDeleteProduct(null);

                shopify.modal.hide(
                  "delete-product-modal"
                );
              }}
            >
              Cancel
            </s-button>

            <s-button
              slot="primary-action"
              variant="primary"
              tone="critical"
              loading={fetcher.state === "submitting"}
              disabled={
                fetcher.state !== "idle" ||
                !deleteProduct
              }
              onClick={() => {
                if (!deleteProduct) return;

                fetcher.submit(
                  {
                    intent: "delete-product",
                    productId: deleteProduct.id,
                  },
                  {
                    method: "post",
                  }
                );
              }}
            >
              Delete product
            </s-button>
          </s-modal>
        </s-page>
      </s-box>
    </>
  );
}