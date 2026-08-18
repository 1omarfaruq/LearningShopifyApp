import { useState } from 'react';

export default function Reviews() {
  const [activeTab, setActiveTab] = useState('requests');

  return (
    <s-page heading="Judge.me Reviews">

      {/* =========================
          TOP TABS
      ========================== */}
      <s-section>
        <s-stack
          direction="inline"
          gap="none"
        >
          <s-button
            variant={activeTab === 'reviews' ? 'primary' : 'tertiary'}
            onClick={() => setActiveTab('reviews')}
          >
            ★ &nbsp; Reviews
          </s-button>

          <s-button
            variant={activeTab === 'requests' ? 'primary' : 'tertiary'}
            onClick={() => setActiveTab('requests')}
          >
            ✉ &nbsp; Review requests
          </s-button>

          <s-button
            variant={activeTab === 'questions' ? 'primary' : 'tertiary'}
            onClick={() => setActiveTab('questions')}
          >
            ◯ &nbsp; Customer questions
          </s-button>
        </s-stack>
      </s-section>


      {/* =========================
          REQUEST HISTORY
      ========================== */}
      {activeTab === 'requests' && (
        <s-section heading="Request History">

          <s-stack
            direction="inline"
            justifyContent="space-between"
            alignItems="center"
          >

            {/* Left side */}
            <s-text>
              Request History
            </s-text>

            {/* Right side actions */}
            <s-stack
              direction="inline"
              gap="small"
            >

              <s-button>
                Edit request schedule
              </s-button>

              <s-button>
                Edit email templates
              </s-button>

              <s-button variant="primary">
                Request reviews
              </s-button>

              <s-button>
                More actions⌄
              </s-button>

            </s-stack>

          </s-stack>


          {/* =========================
              EMPTY STATE
          ========================== */}
          <s-box
            padding="large"
            border="base"
            borderRadius="base"
          >

            <s-stack
              alignItems="center"
              justifyContent="center"
              gap="base"
            >

              {/* Icon */}
              <s-box
                padding="base"
                borderRadius="base"
              >
                <s-text size="large">
                  📝
                </s-text>
              </s-box>


              {/* Heading */}
              <s-heading>
                Track automatic review requests here
              </s-heading>


              {/* Description */}
              <s-text
                color="subdued"
                alignment="center"
              >
                We collect reviews automatically from your customers
                2 weeks after the order has been fulfilled. You can
                also schedule requests from orders fulfilled before
                you installed Judge.me.
              </s-text>

            </s-stack>

          </s-box>

        </s-section>
      )}


      {/* =========================
          REVIEWS TAB
      ========================== */}
      {activeTab === 'reviews' && (
        <s-section heading="Reviews">

          <s-stack
            alignItems="center"
            justifyContent="center"
            gap="base"
          >
            <s-heading>
              Reviews
            </s-heading>

            <s-text color="subdued">
              Your customer reviews will appear here.
            </s-text>
          </s-stack>

        </s-section>
      )}


      {/* =========================
          CUSTOMER QUESTIONS
      ========================== */}
      {activeTab === 'questions' && (
        <s-section heading="Customer questions">

          <s-stack
            alignItems="center"
            justifyContent="center"
            gap="base"
          >
            <s-heading>
              Customer questions
            </s-heading>

            <s-text color="subdued">
              Customer questions will appear here.
            </s-text>
          </s-stack>

        </s-section>
      )}

    </s-page>
  );
}