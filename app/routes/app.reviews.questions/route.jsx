
export default function QuestionsPages() {
    return (
        <s-box padding="small">
            <s-stack direction="inline" justifyContent="space-between" alignItems="center">
                <s-stack direction="inline" gap="small" alignItems="center">
                    <h2>Customer Questions</h2>

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
    );
}