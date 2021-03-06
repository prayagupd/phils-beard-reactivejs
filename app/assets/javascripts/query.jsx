var QueryBox = React.createClass({
  loadCommentsFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.loadCommentsFromServer();
    setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },
  render: function() {
    return (
      <div className="QueryBox">
        <h1>Query</h1>
        <CommentList data={this.state.data} />
        <QueryForm />
      </div>
    );
  }
});

var CommentList = React.createClass({
  render:
  function() {
    var commentNodes = this.props.data.map(function (comment) {
      return (
        <Comment key={comment.docId} document={comment.document}>
          {comment.result}
        </Comment>
      );
    });

    return (
      <div className="commentList">
        {commentNodes}
      </div>
    );
  }
});

var QueryForm = React.createClass({

  handleSubmit: function(e) {
    e.preventDefault();
    var document = React.findDOMNode(this.refs.document).value.trim();
    var result = React.findDOMNode(this.refs.result).value.trim();
    if (!document) {
      return;
    }

    var queryUrl = "http://localhost:9000/query?document=" + document;
    $.ajax({
          url: queryUrl,
          method: 'POST',
          dataType: 'json',
          cache: false,
          success: function(data) {
            console.log(data)
          }.bind(this),
          error: function(xhr, status, err) {
            console.error(queryUrl, status, err.toString());
          }.bind(this)
        });

    // clears the form fields
    React.findDOMNode(this.refs.result).value = '';
    return;
  },

  render: function() {
    return (
      <form className="queryForm" onSubmit={this.handleSubmit}>
        <textarea type="result" placeholder="DB query" ref="document" rows="25" cols="50"/>
        <br/>
        <input type="submit" value="Query" />
        <br/>
        <textarea type="result" placeholder="Query Result" ref="result" rows="25" cols="50"/>
      </form>
    );
  }
});

var Comment = React.createClass({
  render: function() {
    var rawMarkup = marked(this.props.children.toString(), {sanitize: true});

    return (
      <div className="comment">
        <h2 className="commentDocument">
          {this.props.document}
        </h2>
        <span dangerouslySetInnerHTML={{__html: rawMarkup}} />
      </div>
    );
  }
});

React.render(
  <QueryBox url="http://localhost:9000/queries" pollInterval={2000} />,
  document.getElementById('content'));
