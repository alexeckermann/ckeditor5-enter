/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* globals document */

import View from '@ckeditor/ckeditor5-engine/src/view/view';
import EnterObserver from '../src/enterobserver';
import DomEventData from '@ckeditor/ckeditor5-engine/src/view/observer/domeventdata';
import createViewRoot from '@ckeditor/ckeditor5-engine/tests/view/_utils/createroot';
import { getCode } from '@ckeditor/ckeditor5-utils/src/keyboard';

describe( 'EnterObserver', () => {
	let view, viewDocument;

	beforeEach( () => {
		view = new View();
		viewDocument = view.document;
		view.addObserver( EnterObserver );
	} );

	// See #10.
	it( 'can be initialized', () => {
		expect( () => {
			createViewRoot( viewDocument );
			view.attachDomRoot( document.createElement( 'div' ) );
		} ).to.not.throw();
	} );

	describe( 'enter event', () => {
		it( 'is fired on keydown', () => {
			const spy = sinon.spy();

			viewDocument.on( 'enter', spy );

			viewDocument.fire( 'keydown', new DomEventData( viewDocument, getDomEvent(), {
				keyCode: getCode( 'enter' )
			} ) );

			expect( spy.calledOnce ).to.be.true;
		} );

		it( 'is not fired on keydown when keyCode does not match enter', () => {
			const spy = sinon.spy();

			viewDocument.on( 'enter', spy );

			viewDocument.fire( 'keydown', new DomEventData( viewDocument, getDomEvent(), {
				keyCode: 1
			} ) );

			expect( spy.calledOnce ).to.be.false;
		} );

		it( 'should stop keydown event when enter event is stopped', () => {
			const keydownSpy = sinon.spy();
			viewDocument.on( 'keydown', keydownSpy );
			viewDocument.on( 'enter', evt => evt.stop() );

			viewDocument.fire( 'keydown', new DomEventData( viewDocument, getDomEvent(), {
				keyCode: getCode( 'enter' )
			} ) );

			sinon.assert.notCalled( keydownSpy );
		} );

		it( 'should not stop keydown event when enter event is not stopped', () => {
			const keydownSpy = sinon.spy();
			viewDocument.on( 'keydown', keydownSpy );
			viewDocument.on( 'enter', evt => evt.stop() );

			viewDocument.fire( 'keydown', new DomEventData( viewDocument, getDomEvent(), {
				keyCode: getCode( 'x' )
			} ) );

			sinon.assert.calledOnce( keydownSpy );
		} );
	} );

	function getDomEvent() {
		return {
			preventDefault: sinon.spy()
		};
	}
} );
