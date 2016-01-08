(function () {
  var pdfDocument = require('pdfkit');
  var List = require('jscollection').List;
  var _ = new require('lodash');

  /**
   * @param options Options for Document
   * {
      layout: 'portrait', // can be 'landscape'
      size: 'A4',
      margins: { top: 0, bottom: 0, left: 0, right: 0},
      info: {
        Title: 'title',
        Author: 'cnMaestro',        // the name of the author
        Subject: '',                // the subject of the document
        Keywords: 'pdf;javascript', // keywords associated with the document
        CreationDate: 'DD/MM/YYYY', // the date the document was created (added automatically by PDFKit)
        ModDate: 'DD/MM/YYYY'       // the date the document was last modified
      }
    }
   * @constructor
   */
  var PDF = {};
  PDF.Size = {
    Auto: 'a'
  };

  PDF._calculateTextHeight = function (str, options) {
    var height = 0;

    var line = function () {
      return height += this.currentLineHeight(true);
    };

    var wrapper = new LineWrapper(this._doc, options);
    wrapper.on('line', line.bind(this._doc));
    wrapper.wrap(str, options);

    if (this._maxHeight !== PDF.Size.Auto && height > maxHeight) {
      return this._maxHeight;
    } else {
      return height;
    }
  };

  PDF.Table = function (pdfKit, topY) {
    this._doc = pdfKit;
    this._leftX = this._doc.page.margins.left;
    this._topY = topY;
    this.columns = new List();
    console.log("width=" + this.width());
  };

  PDF.Table.prototype.width = function () {
    var pg = this._doc.page;
    return pg.width - pg.margins.left - pg.margins.right;
  };

  PDF.Table.prototype.invalidate = function () {
    this.columns.clear();
  };

  /**
   * @description Returns if current page is over
   */
  PDF.Table.prototype.addRow = function (columnsData) {

  };

  PDF.Table.prototype.startRender = function () {
    var self = this;
    this._renderStarted = true;

    this.columns.forEach(function (td) {
      td._init(self);
    });

    this._renderHeader();
  };

  PDF.Table.prototype._renderHeader = function () {
    var self = this;
    var leftX = self._leftX;
    this.columns.forEach(function (td) {
      leftX = td._render(self, leftX, self._topY, td._title);
    });
  };

  PDF.Table.prototype.renderRow = function (columnsData) {
    if (!this._renderStarted) {
      throw  new Error("PDF table render is not initiated. call startRender to initiate");
    }


  };

  /**
   *
   * @param title
   * @param option
   * @constructor
   */
  PDF.Table.Column = function (title, option) {
    this._title = title;
    this._widthInPercent = (option && _.isDefined(option.widthInPercent)) ? option.widthInPercent : PDF.Size.Auto;
    this._padding = (option && _.isDefined(option.padding)) ? option.padding : {left: 1, top: 1, right: 1, bottom: 1};
    this._borderWidth = (option && _.isDefined(option.borderWidth)) ? option.borderWidth : 1;
    this._borderColor = (option && _.isDefined(option.borderColor)) ? option.borderColor : 'gray';
  };

  PDF.Table.Column.prototype._init = function (tb) {
    var tbWidth = tb.width();
    this._cWidth = (tbWidth * (this._widthInPercent / 100)); // Calculated Width of a column
    this._cTxtWidth = this._cWidth - this._padding.left - this._padding.right; // calculated width of text
  };

  PDF.Table.Column.prototype._render = function (tb, leftX, topY, content) {
    var self = this;
    var doc = tb._doc;
    var tbWidth = tb.width();
    // Draw top line
    // Render the text
    // Draw left line
    // Draw right line
    // Return recommended top line

    doc.moveTo(leftX, topY).lineTo(leftX + tbWidth, topY).stroke(); // Draw top line
    doc.text(content, {
      left: leftX + self._padding.left,
      top: topY + self._padding.top,
      lineBreak: true, ellipsis: true, width: self._cTxtWidth
    });

    return leftX;
  };

  PDF.Table.Column.prototype._renderHeader = function (tbl) {
    var doc = tbl._doc;

  };

  module.exports = PDF;
})();

