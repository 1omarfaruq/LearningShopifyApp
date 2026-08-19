
export default function ReviewsPages() {
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
                            <div className="sec-tab-btn active">
                                All Reviews
                            </div>
                            <div className="sec-tab-btn">
                                Padding
                            </div>
                            <div className="sec-tab-btn">
                                Product Reviews
                            </div>
                            <style>
                                {`
                                    .sec-tab-btn{
                                        border-radius: 10px;
                                        padding: 8px 12px;
                                        color: #4e4e4e;
                                    }
                                    .sec-tab-btn.active{
                                        background: #d5d4d4;
                                    }
                                    .sec-tab-btn:hover{
                                        background: #f0f0f0;
                                    }
                                `}
                            </style>
                        </s-stack>

                        <s-stack direction="inline" gap="small">
                            <s-button href="javascript:void(0)">
                                <s-icon type="search"></s-icon>
                            </s-button>
                            <s-button href="javascript:void(0)">
                                <s-icon type="sort"></s-icon>
                            </s-button>
                        </s-stack>
                    </s-stack>
                </s-box>
            </s-section>
        </s-box>
        </>
    );
}