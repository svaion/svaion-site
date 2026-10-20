export interface Link {
  readonly label: string;
  readonly href: string;
}

/** Running text: plain strings, with links where the notice points somewhere. */
export type Inline = string | Link;

export interface ListItem {
  readonly term?: string;
  readonly content: readonly Inline[];
}

export type Block =
  | { readonly kind: "paragraph"; readonly content: readonly Inline[] }
  | { readonly kind: "list"; readonly items: readonly ListItem[] };

export interface NoticeSection {
  readonly id: string;
  readonly heading: string;
  readonly blocks: readonly Block[];
}

/** Everything the privacy notice page renders, already worded. */
export interface PrivacyNoticeView {
  readonly meta: {
    readonly title: string;
    readonly description: string;
  };
  readonly head: {
    readonly title: string;
    readonly updatedLabel: string;
    /** For people: "October 20, 2026". */
    readonly updated: string;
    /** For machines: "2026-10-20". */
    readonly updatedIso: string;
    readonly intro: string;
  };
  readonly contentsLabel: string;
  readonly sections: readonly NoticeSection[];
  readonly contact: {
    readonly heading: string;
    readonly body: string;
    readonly email: { readonly address: string; readonly href: string };
  };
}
