import { useState } from "react";
import { useNavigate } from "react-router";

export default function ReviewsPages() {
    const [activeBtn, setActiveBtn] = useState("All Reviews");
    const navigate = useNavigate();
    
    function handelNavigate(path, active = activeBtn) {
        navigate(path);
        setActiveBtn(active);
    }

    function handelSort(event) {
        const value = event.currentTarget.values[0];

      handelNavigate(`?page=1&sort=${value}`);
    }

    return (
        <>
        <s-box padding="small small none small">
            <s-stack direction="inline" justifyContent="space-between" alignItems="center">
                <s-stack direction="inline" gap="small" alignItems="center">
                    <h2>Reviews</h2>

                    <s-tooltip id="auto-publish-tooltip">This order has active shipping labels.</s-tooltip>
                    <s-badge tone="success" interestFor="auto-publish-tooltip"> 
                        <span className="live-bullate"></span> Auto-publish: On
                    </s-badge>
                    
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
                    <s-button commandFor="export-menu">Export</s-button>

                    <s-menu id="export-menu" accessibilityLabel="Export actions">
                        <s-button icon="merge">Merge customer</s-button>
                        <s-button icon="incoming">Request customer data</s-button>
                        <s-button icon="delete" tone="critical">Delete customer</s-button>
                    </s-menu>
                </s-stack>
            </s-stack>
        </s-box>

        <s-box padding="none small">
            <s-section padding="none">
                <s-box padding="small">
                    <s-stack direction="inline" justifyContent="space-between" alignItems="center">
                        <s-stack direction="inline" gap="small">
                            <button className={`sec-tab-btn ${activeBtn === "All Reviews" ? "active" : ""}`} onClick={() => handelNavigate('?page=1&review_kind=all_reviews', 'All Reviews')}>
                                All Reviews
                            </button>
                            <button className={`sec-tab-btn ${activeBtn === "Padding" ? "active" : ""}`} onClick={() => handelNavigate('?page=1&status_filter=needing_curation&review_kind=all_reviews', 'Padding')}>
                                Padding
                            </button>
                            <button className={`sec-tab-btn ${activeBtn === "Product Reviews" ? "active" : ""}`} onClick={() => handelNavigate('?page=1&review_kind=product_reviews', 'Product Reviews')}>
                                Product Reviews
                            </button>
                            <button className={`sec-tab-btn ${activeBtn === "Store Reviews" ? "active" : ""}`} onClick={() => handelNavigate('?page=1&review_kind=shop_reviews', 'Store Reviews')}>
                                Store Reviews
                            </button>
                            <button className={`sec-tab-btn ${activeBtn === "Spam" ? "active" : ""}`} onClick={() => handelNavigate('?page=1&review_kind=spam', 'Spam')}>
                                Spam
                            </button>
                            <button className={`sec-tab-btn ${activeBtn === "Archive" ? "active" : ""}`} onClick={() => handelNavigate('?page=1&review_kind=archive', 'Archive')}>
                                Archive
                            </button>
                            <style>
                                {`
                                    .sec-tab-btn{
                                        border: none;
                                        border-radius: 10px;
                                        padding: 8px 12px;
                                        color: #4e4e4e;
                                        background: none;
                                    }
                                    .sec-tab-btn.active,
                                    .sec-tab-btn.active:hover{
                                        font-weight: 600;
                                        background: #d5d4d4;
                                    }
                                    .sec-tab-btn:hover{
                                        cursor: pointer;
                                        background: #f0f0f0;
                                    }
                                `}
                            </style>
                        </s-stack>
                        

                        <s-stack direction="inline" gap="small">
                            <s-button href="javascript:void(0)">
                                <s-icon type="search"></s-icon>
                            </s-button>
                            <s-button commandFor="sort-popover">
                                <s-icon type="sort"></s-icon>
                            </s-button>

                            <s-popover id="sort-popover" accessibilityLabel="Sort actions">
                                <s-stack padding="small">
                                    <s-choice-list name="short" onChange={() => handelNavigate('?page=1&sort=asc')}>
                                        <s-choice value="asc">Ascending (A-Z)</s-choice>
                                        <s-choice value="dsc" selected>Descending (Z-A)</s-choice>
                                    </s-choice-list>
                                </s-stack>
                            </s-popover>
                        </s-stack>
                    </s-stack>
                </s-box>
            </s-section>
        </s-box>
        </>
    );
}