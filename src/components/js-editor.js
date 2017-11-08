import React, { Component } from 'react';
import './editor.css';

var { Editor, EditorState, convertFromRaw, RichUtils } = require('draft-js');
var PrismDecorator = require('draft-js-prism');
var beautify = require('js-beautify').js_beautify

var newRender = function (props) {
	return <span className={'prism-token ' + props.type}>{props.children}</span>
}
var decorator = new PrismDecorator({
	defaultSyntax: String('javascript'),
	render: newRender
});

var contentState = convertFromRaw({
	entityMap: {},
	blocks: [{
		type: 'code-block',
		text: `window.send({message:'right'})`
	}]
});

class JsEditor extends Component {
	constructor(props) {
		super()
		this.state = { editorState: EditorState.createWithContent(contentState, decorator) }
		this.handleEditorChange = (editorState) => {this.setState({ editorState })}
		this.onTab=this._onTab.bind(this);
	}

	render() {
		return (
			<div className="editor">
				<Editor ref="editor" editorState={this.state.editorState} onTab={this.onTab} onChange={this.handleEditorChange}></Editor>
				{this.line()}
				<div className="btn-group">
					<button className="btn" onClick={_=>this.formmater()}>格式化</button>
				    <button className="btn" onClick={_=>this.copy()}>复制</button></div>
				    <button className="btn">保存修改</button>
				    <textarea ref="cacheCopyText" className="clips-area" type="text"></textarea>
			</div>
		);
	}

	lineLength() {
		return this.state.editorState.getCurrentContent().getBlocksAsArray().length
	}

	line(){
		var lineLength=this.lineLength();
		var numberList=[];
		while(lineLength--){numberList.unshift(<li key={lineLength}>{lineLength+1}</li>)};
		return <ul className="line">{numberList}</ul>
	}

	_onTab(e){
		e.preventDefault();
        this.handleEditorChange(RichUtils.onTab(e, this.state.editorState, 4));
	}

	formmater() {
		var targetText=this.state.editorState.getCurrentContent().getPlainText();

		var newBlocks=beautify(targetText).split(/\n/).map(function(text){
			return {
				type:'code-block',
				text:text
			}
		})
		this.setState({editorState:EditorState.createWithContent(convertFromRaw({
			entityMap:{},
			blocks:newBlocks
		}),decorator)})
	}

	copy(){
		this.refs.cacheCopyText.value=this.state.editorState.getCurrentContent().getPlainText();
		this.refs.cacheCopyText.select();
		document.execCommand("Copy");
	}
}

export default JsEditor;