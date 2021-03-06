/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import VirtualTestEditor from '@ckeditor/ckeditor5-core/tests/_utils/virtualtesteditor';
import Enter from '../src/enter';
import EnterCommand from '../src/entercommand';
import DomEventData from '@ckeditor/ckeditor5-engine/src/view/observer/domeventdata';

describe( 'Enter feature', () => {
	let editor, viewDocument;

	beforeEach( () => {
		return VirtualTestEditor
			.create( {
				plugins: [ Enter ]
			} )
			.then( newEditor => {
				editor = newEditor;
				viewDocument = editor.editing.view.document;
			} );
	} );

	it( 'creates the commands', () => {
		expect( editor.commands.get( 'enter' ) ).to.be.instanceof( EnterCommand );
	} );

	it( 'listens to the editing view enter event', () => {
		const spy = editor.execute = sinon.spy();
		const domEvt = getDomEvent();

		viewDocument.fire( 'enter', new DomEventData( viewDocument, domEvt ) );

		expect( spy.calledOnce ).to.be.true;
		expect( spy.calledWithExactly( 'enter' ) ).to.be.true;

		expect( domEvt.preventDefault.calledOnce ).to.be.true;
	} );

	it( 'scrolls the editing document to the selection after executing the command', () => {
		const domEvt = getDomEvent();
		const executeSpy = editor.execute = sinon.spy();
		const scrollSpy = sinon.stub( editor.editing.view, 'scrollToTheSelection' );

		viewDocument.fire( 'enter', new DomEventData( viewDocument, domEvt ) );

		sinon.assert.calledOnce( scrollSpy );
		sinon.assert.callOrder( executeSpy, scrollSpy );
	} );

	function getDomEvent() {
		return {
			preventDefault: sinon.spy()
		};
	}
} );
