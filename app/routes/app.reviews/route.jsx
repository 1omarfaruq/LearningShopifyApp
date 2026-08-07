export default function Reviews() {
  return (
    <s-page heading="Reviews">
      <s-section heading="Buttons">
        <s-button>Primary</s-button>
        <s-button variant="secondary">Secondary</s-button>
        <s-button variant="destructive">Destructive</s-button>
        <s-button variant="outline">Outline</s-button>
        <s-button disabled="true">Disabled</s-button>
        <br />
        <s-button variant="primary" icon="code" tone="critical">
          Replace Icon
        </s-button>
        <br />
        <s-button commandFor="actions-popover">More actions</s-button>

        <s-popover id="actions-popover">
          <s-stack direction="block">
            <s-button variant="tertiary">Export products</s-button>
            <s-button variant="tertiary">Import products</s-button>
            <s-button variant="tertiary">Print labels</s-button>
          </s-stack>
        </s-popover>
      </s-section>
    </s-page>
  );
}
