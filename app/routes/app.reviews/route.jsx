import { useState } from "react";
import { Outlet, useNavigate } from "react-router";

export default function ReviewsPage(){
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('reviews');

    function handelTabNavigate(url, activeLabel) {
        navigate(url)
        setActiveTab(activeLabel);
    }

    return (
        <>
            <s-box padding="small">
                <s-section padding="none">
                    <s-stack direction="inline" padding="none small" gap="small">
                        <div className={`tab-btn ${activeTab === "reviews" ? "active" : ""}`} onClick={() => handelTabNavigate('', 'reviews')}>
                            <span><s-icon type="star-filled" direction="inline"></s-icon> Reviews</span>
                        </div>
                        <div className={`tab-btn ${activeTab === "questions" ? "active" : ""}`} onClick={() => handelTabNavigate('questions', 'questions')}>
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
            </s-box>

            <Outlet />
        </>
    );
}