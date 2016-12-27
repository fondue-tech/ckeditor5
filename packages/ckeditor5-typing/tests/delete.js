/**
 * @license Copyright (c) 2003-2016, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import VirtualTestEditor from 'ckeditor5-core/tests/_utils/virtualtesteditor';
import Delete from 'ckeditor5-typing/src/delete';
import DomEventData from 'ckeditor5-engine/src/view/observer/domeventdata';

describe( 'Delete feature', () => {
	let editor, editingView;

	beforeEach( () => {
		return VirtualTestEditor.create( {
				plugins: [ Delete ]
			} )
			.then( newEditor => {
				editor = newEditor;
				editingView = editor.editing.view;
			} );
	} );

	it( 'creates two commands', () => {
		expect( editor.commands.get( 'delete' ) ).to.have.property( 'direction', 'backward' );
		expect( editor.commands.get( 'forwardDelete' ) ).to.have.property( 'direction', 'forward' );
	} );

	it( 'listens to the editing view delete event', () => {
		const spy = editor.execute = sinon.spy();
		const view = editor.editing.view;
		const domEvt = getDomEvent();

		view.fire( 'delete', new DomEventData( editingView, domEvt, {
			direction: 'forward',
			unit: 'character'
		} ) );

		expect( spy.calledOnce ).to.be.true;
		expect( spy.calledWithMatch( 'forwardDelete', { unit: 'character' } ) ).to.be.true;

		expect( domEvt.preventDefault.calledOnce ).to.be.true;

		view.fire( 'delete', new DomEventData( editingView, getDomEvent(), {
			direction: 'backward',
			unit: 'character'
		} ) );

		expect( spy.calledTwice ).to.be.true;
		expect( spy.calledWithMatch( 'delete', { unit: 'character' } ) ).to.be.true;
	} );

	function getDomEvent() {
		return {
			preventDefault: sinon.spy()
		};
	}
} );
