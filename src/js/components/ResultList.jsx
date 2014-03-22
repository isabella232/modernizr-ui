/**
 * @jsx React.DOM
 */

var React = require('react');
var Result = require('./Result.jsx');
var TagResult = require('./TagResult.jsx');
var ResultActions = require('../actions/ResultActions');
var SelectionActions = require('../actions/SelectionActions');

var Results = React.createClass({
	componentDidMount: function() {
		$(window).on('keydown', this._onKeyDown);
		$(document).on('keydown', function(e) {
			if(e.which === 38 || e.which === 40) {
				e.preventDefault();
			}
		});
	},

	componentDidUpdate: function(prevProps, prevState) {
		var scrollTop = $(this.getDOMNode()).scrollTop();
		var resultHeight = $(this.refs.firstResult.getDOMNode()).height();
		var index = this.props.currentIndex || 0;
		var offset = index * (resultHeight + 1) - 1;
		var resultListHeight = $(this.getDOMNode()).height();
		var bottomOffset = resultHeight / 2;
		if((offset + resultHeight) > (scrollTop + resultListHeight)) {
			scrollTop = (offset + resultHeight) - resultListHeight;
			$(this.getDOMNode()).scrollTop(scrollTop + bottomOffset);
		}
		else if(offset < scrollTop) {
			$(this.getDOMNode()).scrollTop(offset);
		}
	},

	render: function() {
		return (
			<div className="results">
				{this.props.results.map(function(result, i) {
					var current = this.props.currentResult && this.props.currentResult.cid === result.cid;
					var ref = i === 0 ? 'firstResult' : null
					if(result.type === 'detect') {
						var added = this.props.selection && this.props.selection[result.cid];
						return <Result ref={ref} detect={result} current={current} added={added} />
					}
					else {
						return <TagResult ref={ref} tag={result} current={current} />
					}
				}.bind(this))}
			</div>
		);
	},

	_onKeyDown: function(e) {
		switch(e.which) {
			case 38: // Up
				ResultActions.up();
			break;
			case 40: // Down
				ResultActions.down();
			break;
			case 13: // Enter
				if(this.props.currentResult && this.props.currentResult.type === 'detect') {
					var added = this.props.selection && this.props.selection[this.props.currentResult.cid];
					if(added) {
						SelectionActions.remove(this.props.currentResult.cid);
					}
					else {
						SelectionActions.add(this.props.currentResult);
					}
				}
				else {
					ResultActions.down();
				}
			break;
			case 27: // Esc
				ResultActions.blur();
			break;
		}
	}
});

module.exports = Results;