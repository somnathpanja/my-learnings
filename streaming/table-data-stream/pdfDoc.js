(function () {
  var pdfDocument = require('pdfkit');
  var List = require('jscollection').List;
  var _ = new require('lodash');
  var LineWrapper = require('./../../node_modules/pdfkit/js/line_wrapper');

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

  PDF._calculateTextHeight = function (doc, str, options) {
    var height = 0;

    var line = function () {
      return height += this.currentLineHeight(true);
    };

    var wrapper = new LineWrapper(doc, options);
    wrapper.on('line', line.bind(doc));
    wrapper.wrap(str, options);

    if (options.maxHeight && options.maxHeight !== PDF.Size.Auto && height > options.maxHeight) {
      return options.maxHeight;
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

  PDF.Table.prototype.startRender = function () {
    var self = this;
    this.columns.forEach(function (td) {
      td._init(self);
    });

    this._renderHeader();
    this._renderStarted = true;
  };

  PDF.Table.prototype._renderHeader = function () {
    this._renderRow(true);
  };

  PDF.Table.prototype._renderRow = function (isHeader, contents) {
    var self = this;
    var pg = self._doc.page;
    var leftX = self._leftX;
    var colHeights = [];

    // Draw top line and render content
    this.columns.forEach(function (td, idx) {
      var content = isHeader ? td._title : contents[idx];
      var info = td._renderContent(self, leftX, self._topY, isHeader, content);
      leftX = info.leftX;
      colHeights.push(info.columnHeight);
    });

    // Draw vertical lines and bottom horizontal line
    leftX = self._leftX;
    var maxHeight = Math.max.apply(Math, colHeights);
    this.columns.forEach(function (td) {
      leftX = td._renderLine(self, leftX, self._topY, maxHeight, isHeader);
    });

    this._topY += maxHeight;

    // Check for next page , taking maxHeight as assumption
    if((this._topY + 2* maxHeight) >= (pg.height - pg.margins.bottom)){
      self._doc.addPage();
      this._topY = pg.margins.top;
    }
  };

  /**
   *
   * @param rowData Array[Strings]
   */
  PDF.Table.prototype.renderRow = function (rowData) {
    if (!this._renderStarted) {
      throw  new Error("PDF table render is not initiated. call startRender to initiate");
    }

    this._renderRow(false, rowData);
  };

  /**
   *
   * @param title
   * @param option
   * @constructor
   */
  PDF.Table.Column = function (title, option) {
    this._title = title;
    this._widthInPercent = (option && !_.isUndefined(option.widthInPercent)) ? option.widthInPercent : PDF.Size.Auto;
    this._padding = (option && !_.isUndefined(option.padding)) ? option.padding : {
      left: 4,
      top: 4,
      right: 4,
      bottom: 4
    };

    this._borderWidth = (option && !_.isUndefined(option.borderWidth)) ? option.borderWidth : 1;
    this._borderColor = (option && !_.isUndefined(option.borderColor)) ? option.borderColor : 'gray';
  };

  PDF.Table.Column.prototype._init = function (tb) {
    var tbWidth = tb.width();
    this._cWidth = (tbWidth * (this._widthInPercent / 100)); // Calculated Width of a column
    this._cTxtWidth = this._cWidth - this._padding.left - this._padding.right; // calculated width of text
  };

  PDF.Table.Column.prototype._renderContent = function (tb, leftX, topY, isHeader, content) {
    var self = this;
    var doc = tb._doc;
    var tbWidth = tb.width();

    // Draw top line
    // Render the text
    doc.moveTo(leftX, topY).lineTo(leftX + self._cWidth, topY).stroke(); // Draw top line

    var contentStyle = {
      lineBreak: true, ellipsis: true, width: self._cTxtWidth
    };

    doc.text(content, leftX + self._padding.left, topY + self._padding.top, contentStyle);

    var txtHeight = PDF._calculateTextHeight(doc, content, contentStyle);
    var finalColumnHeight = self._padding.top + txtHeight + self._padding.bottom;
    return {leftX: leftX + self._cWidth, columnHeight: finalColumnHeight};
  };

  PDF.Table.Column.prototype._renderLine = function (tb, leftX, topY, height, isHeader) {
    var self = this;
    var doc = tb._doc;
    // Draw top to bottom and then left to right line and stroke
    doc.moveTo(leftX, topY).lineTo(leftX, topY + height).lineTo(leftX + self._cWidth, topY + height).stroke();
    leftX = leftX + self._cWidth;

    // Draw the right most vertical line
    if (tb.columns.last(0) == self) {
      doc.moveTo(leftX, topY).lineTo(leftX, topY + height).stroke(); // Draw top line
    }

    return leftX;
  };

  module.exports = PDF;
})();

