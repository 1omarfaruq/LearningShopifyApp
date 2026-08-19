import { Outlet } from "react-router";

export default function TestPage(){
    return (
        <s-box padding="small">
            <s-section padding="none">
                <s-stack direction="inline" padding="none small" gap="small">
                    <s-clickable className="tab-btn active" href="reviews">
                        <span><s-icon type="star-filled" direction="inline"></s-icon> Reviewsa</span>
                    </s-clickable>
                    <s-clickable className="tab-btn" href="questions">
                        <span><s-icon type="question-circle" direction="inline"></s-icon> Customer Questions</span>
                    </s-clickable>
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
        </s-box>
    );
}