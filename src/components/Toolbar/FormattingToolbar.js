// @flow
import * as React from "react";
import styled, { withTheme } from "styled-components";
import { Editor } from "slate-react";
import {
  BoldIcon,
  CodeIcon,
  Heading1Icon,
  Heading2Icon,
  ItalicIcon,
  BlockQuoteIcon,
  LinkIcon,
  StrikethroughIcon,
} from "outline-icons";
import type { Theme, Mark, Block } from "../../types";
import ToolbarButton from "./ToolbarButton";

type Props = {
  editor: Editor,
  onCreateLink: (SyntheticEvent<*>) => *,
  theme: Theme,
};

class FormattingToolbar extends React.Component<Props> {
  /**
   * Check if the current selection has a mark with `type` in it.
   *
   * @param {String} type
   * @return {Boolean}
   */
  hasMark = (type: string) => {
    try {
      return this.props.editor.value.marks.some(mark => mark.type === type);
    } catch (_err) {
      return false;
    }
  };

  isBlock = (type: string) => {
    const startBlock = this.props.editor.value.startBlock;
    return startBlock && startBlock.type === type;
  };

  /**
   * When a mark button is clicked, toggle the current mark.
   *
   * @param {Event} ev
   * @param {String} type
   */
  onClickMark = (ev: SyntheticEvent<*>, type: string) => {
    ev.preventDefault();
    ev.stopPropagation();

    const { editor } = this.props;
    editor.toggleMark(type);

    // ensure we remove any other marks on inline code
    // we don't allow bold / italic / strikethrough code.
    const isInlineCode = this.hasMark("code") || type === "code";
    if (isInlineCode) {
      editor.value.marks.forEach(mark => {
        if (mark.type !== "code") editor.removeMark(mark);
      });
    }
  };

  onClickBlock = (ev: SyntheticEvent<*>, type: string) => {
    ev.preventDefault();
    ev.stopPropagation();

    this.props.editor.setBlocks(type);
  };

  handleCreateLink = (ev: SyntheticEvent<*>) => {
    ev.preventDefault();
    ev.stopPropagation();

    const data = { href: "" };
    this.props.editor.wrapInline({ type: "link", data });
    this.props.onCreateLink(ev);
  };

  renderMarkButton = (type: Mark, IconClass: Function) => {
    const { hiddenToolbarButtons } = this.props.theme;

    if (
      hiddenToolbarButtons &&
      hiddenToolbarButtons.marks &&
      hiddenToolbarButtons.marks.includes(type)
    )
      return null;

    const isActive = this.hasMark(type);
    const onMouseDown = ev => this.onClickMark(ev, type);

    return (
      <ToolbarButton onMouseDown={onMouseDown} active={isActive}>
        <IconClass color={this.props.theme.toolbarItem} />
      </ToolbarButton>
    );
  };

  renderBlockButton = (type: Block, IconClass: Function) => {
    const { hiddenToolbarButtons } = this.props.theme;
    if (
      hiddenToolbarButtons &&
      hiddenToolbarButtons.blocks &&
      hiddenToolbarButtons.blocks.includes(type)
    )
      return null;

    const isActive = this.isBlock(type);
    const onMouseDown = ev =>
      this.onClickBlock(ev, isActive ? "paragraph" : type);

    return (
      <ToolbarButton onMouseDown={onMouseDown} active={isActive}>
        <IconClass color={this.props.theme.toolbarItem} />
      </ToolbarButton>
    );
  };

  render() {
    return (
      <span>
        {this.renderMarkButton("bold", BoldIcon)}
        {this.renderMarkButton("italic", ItalicIcon)}
        {this.renderMarkButton("deleted", StrikethroughIcon)}
        {this.renderMarkButton("code", CodeIcon)}
        <Separator />
        {this.renderBlockButton("heading2", Heading1Icon)}
        {this.renderBlockButton("heading3", Heading2Icon)}
        {this.renderBlockButton("block-quote", BlockQuoteIcon)}
        <Separator />
        <ToolbarButton onMouseDown={this.handleCreateLink}>
          <LinkIcon color={this.props.theme.toolbarItem} />
        </ToolbarButton>
      </span>
    );
  }
}

const Separator = styled.div`
  height: 100%;
  width: 1px;
  background: ${props => props.theme.toolbarItem};
  opacity: 0.2;
  display: inline-block;
  margin-left: 10px;
`;

export default withTheme(FormattingToolbar);
