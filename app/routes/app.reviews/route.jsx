import { Outlet } from "react-router";

export default function ReviewsPage(){
    return (
        <s-box padding="small">
            <s-section padding="none">
                <s-stack direction="inline" padding="none small" gap="small">
                    <div className="tab-btn active">
                        <span><s-icon type="star-filled" direction="inline"></s-icon> Reviews</span>
                    </div>
                    <div className="tab-btn">
                        <span><s-icon type="question-circle" direction="inline"></s-icon> Customer Questions</span>
                    </div>
                </s-stack>
                <style>
                {`
                    .tab-btn {
                        position: relative;
                        display: flex;
                        flex-direction: column;
                        color: #303030;
                        opacity: 0.6;
                        cursor: pointer;
                    }

                    .tab-btn.active {
                        opacity: 1;
                    }

                    .tab-btn span {
                        display: flex;
                        gap: 4px;
                        padding: 12px 16px;
                    }

                    .tab-btn:hover {
                        opacity: 1;
                    }

                    .tab-btn::after {
                        content: "";
                        height: 4px;
                        background: #303030;
                        border-radius: 5px 5px 0 0;
                        opacity: 0;
                        transition: opacity 0.2s ease;
                    }

                    .tab-btn:hover::after {
                        opacity: 0.6;
                    }

                    .tab-btn.active::after {
                        opacity: 1;
                    }
                `}
            </style>
            </s-section>

            <Outlet />
            <s-box padding="large-200 none none none">
                <s-stack direction="inline" justifyContent="space-between" alignItems="center">
                    <s-stack direction="inline" gap="small" alignItems="center">
                        <h2>Heading dfgdf 55</h2>
                        <s-badge tone="success" interestFor="auto-publish-tooltip"> 
                            <span className="live-bullate"></span> Auto-publish: On
                        </s-badge>
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
                        <s-button commandFor="export-menu">Export</s-button>

                        <s-menu id="export-menu" accessibilityLabel="Export actions">
                            <s-button icon="merge">Merge customer</s-button>
                            <s-button icon="incoming">Request customer data</s-button>
                            <s-button icon="delete" tone="critical">Delete customer</s-button>
                        </s-menu>
                    </s-stack>
                </s-stack>
            </s-box>
        </s-box>
    );
}