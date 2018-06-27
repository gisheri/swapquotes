'use babel';

import SwapquotesView from './swapquotes-view';
import { CompositeDisposable } from 'atom';

export default {

  swapquotesView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.swapquotesView = new SwapquotesView(state.swapquotesViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.swapquotesView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'swapquotes:swap': () => this.swap()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.swapquotesView.destroy();
  },

  serialize() {
    return {
      swapquotesViewState: this.swapquotesView.serialize()
    };
  },

  swap() {
    let editor
    if (editor = atom.workspace.getActiveTextEditor()) {
      let selection = editor.getSelectedText()
      var swapped = selection.replace(/(["'])/g, function(g1){
        return g1 == "'" ? '"' : "'";
      });
      editor.insertText(swapped)
    }
  }

};
