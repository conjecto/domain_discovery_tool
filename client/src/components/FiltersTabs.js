import React from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
// From https://github.com/oliviertassinari/react-swipeable-views
import SwipeableViews from 'react-swipeable-views';
//import {deepPurpleA400, orange300, blue400, indigoA400, blue900} from 'material-ui/styles/colors';
import Checkbox from 'material-ui/Checkbox';
import CheckboxTree from 'react-checkbox-tree';
import $ from 'jquery';

import CircularProgress from 'material-ui/CircularProgress';

const styles = {
  headline: {
    fontSize: 12,
    paddingTop: 16,
    marginBottom: 12,
    height: '120px',
  },
  slide: {
    height: '100px',
  },
  tab:{
    fontSize: '12px',
  },
};

class CircularProgressSimple extends React.Component{
  render(){

    return(
    <div style={{borderColor:"green", marginLeft:"50%"}}>
      <CircularProgress size={60} thickness={7} />
    </div>
  );}
}


class LoadQueries extends React.Component {
  constructor(props){
    super(props);
    this.state={
      currentQueries:undefined,
      queriesCheckBox:[],
	//checkedQueries:[],
	checked:[],
	expanded:[],
      queryString:"",
      session: {},
      flat:false,
    };
  }

  getAvailableQueries(){
    $.post(
      '/getAvailableQueries',
      {'session': JSON.stringify(this.props.session)},
      function(queriesDomain) {
        this.setState({currentQueries: queriesDomain, session:this.props.session, queryString: JSON.stringify(this.props.session['selected_queries'])});
      }.bind(this)
    );
  }

  componentWillMount(){
    this.getAvailableQueries();
  }
  componentWillReceiveProps(nextProps){
    if(JSON.stringify(nextProps.session['selected_queries']) === this.state.queryString ) {
      this.setState({ flat:true});
      if(this.props.update){
        this.getAvailableQueries();
      }
      return;
    }
    // Calculate new state
    this.setState({
      session:nextProps.session, queryString: JSON.stringify(nextProps.session['selected_queries']), flat:true
    });

  }
  shouldComponentUpdate(nextProps, nextState){
    if(JSON.stringify(nextProps.session['selected_queries']) === this.state.queryString && this.state.flat===true) {
      if(this.props.update){ return true;}
      else {return false;}
    }
    return true;
  }

    addQuery(object){
	console.log("CHECKED QUERY 2 ");
	console.log(object);
	var checked = object["checked"];
	console.log(checked);
	var queries = this.state.queryString.substring(1,this.state.queryString.length-1).split(",");
	checked.map((query, index)=>{
	    if(queries.includes(query)){
		this.props.removeQueryTag(0, query);
	    }
	    else{
		this.props.addQuery(query);
	    }
	});
	//var queries = this.state.checkedQueries;
	//queries.push(query);
	//this.setState({checkedQueries: queries });
    }
    
  render(){
      if(this.state.currentQueries!==undefined){
	  var nodes = [];
	  var queryNode = {
	      value: 'query',
	      label: 'Queries',
	      children: [],
	  };
       
	  Object.keys(this.state.currentQueries).map((query, index)=>{
	      var labelQuery=  query+" " +"(" +this.state.currentQueries[query]+")"; //query (ex. blue car) , index (ex. 0,1,2...)
              var checkedQuery=false;
	      var children = []
              var queries = this.state.queryString.substring(1,this.state.queryString.length-1).split(",");
              if(queries.includes(query)){
		  this.state.checked.push(query);
		  this.state.checked.push("Query");
	      }
	      queryNode.children.push({value:query, label:labelQuery});
              //return <Checkbox label={labelQuery} checked={checkedQuery} style={styles.checkbox}  onClick={this.addQuery.bind(this,query)}/>
          });
	  nodes.push(queryNode);
	  //console.log("CHECKBOX TREE");
	  //console.log(nodes);
      return(
        <div>
        <CheckboxTree
                nodes={nodes}
                checked={this.state.checked}
                expanded={this.state.expanded}
                onCheck={checked => this.addQuery({checked})}
                onExpand={expanded => this.setState({ expanded })}
        />
        </div>
      );
    }
    return(
      <CircularProgressSimple />
    );
  }
}

class LoadTLDs extends React.Component {
  constructor(props){
    super(props);
    this.state={
      currentTLDs:undefined,
      tldsCheckBox:[],
      tldString:"",
      session: {},
      flat:false,
    };
  }

  getAvailableTLDs(){
    $.post(
      '/getAvailableTLDs',
      {'session': JSON.stringify(this.props.session)},
      function(tlds) {
          this.setState({currentTLDs: tlds, session:this.props.session, tldString: JSON.stringify(this.props.session['selected_tlds'])});
      }.bind(this)
    );
  }
    
  componentWillMount(){
    this.getAvailableTLDs();
  }
  componentWillReceiveProps(nextProps){
    if(JSON.stringify(nextProps.session['selected_tlds']) === this.state.tldString ) {
      this.setState({ flat:true});
      if(this.props.update){
        this.getAvailableTLDs();
      }
      return;
    }
    // Calculate new state
    this.setState({
      session:nextProps.session, tldString: JSON.stringify(nextProps.session['selected_tlds']), flat:true
    });

  }
  shouldComponentUpdate(nextProps, nextState){
    if(JSON.stringify(nextProps.session['selected_tlds']) === this.state.tldString && this.state.flat===true) {
      if(this.props.update){ return true;}
      else {return false;}
    }
    return true;
  }

  addTLD(tld){
    var tlds = this.state.tldString.substring(1,this.state.tldString.length-1).split(",");
    if(tlds.includes(tld)){
      this.props.removeQueryTag(4, tld);
    }
    else{
      this.props.addTLD(tld);
    }
  }

  render(){
    if(this.state.currentTLDs!==undefined){
      return(
        <div>
        {Object.keys(this.state.currentTLDs).map((tld, index)=>{
          var labelTLD=  tld+" " +"(" +this.state.currentTLDs[tld]+")"; //tld (ex. www.google.com) , index (ex. 0,1,2...)
          var checkedTLD=false;
          var tlds = this.state.tldString.substring(1,this.state.tldString.length-1).split(",");
          if(tlds.includes(tld))
            checkedTLD=true;
          return <Checkbox label={labelTLD} checked={checkedTLD} style={styles.checkbox}  onClick={this.addTLD.bind(this,tld)}/>
        })}
        </div>
      );
    }
    return(
      <CircularProgressSimple />
    );
  }

}

class LoadAnnotatedTerms extends React.Component {
  constructor(props){
    super(props);
    this.state={
      currentATerms:undefined,
      atermsCheckBox:[],
      atermString:"",
      session: {},
      flat:false,
    };
  }

  getAnnotatedTerms(){
    $.post(
      '/getAnnotatedTerms',
      {'session': JSON.stringify(this.props.session)},
	function(terms) {
          this.setState({currentATerms: terms, session:this.props.session, atermString: JSON.stringify(this.props.session['selected_aterms'])});
      }.bind(this)
    );
  }
    
  componentWillMount(){
    this.getAnnotatedTerms();
  }
  componentWillReceiveProps(nextProps){
    if(JSON.stringify(nextProps.session['selected_aterms']) === this.state.atermString ) {
      this.setState({ flat:true});
      if(this.props.update){
        this.getAnnotatedTerms();
      }
      return;
    }
    // Calculate new state
    this.setState({
      session:nextProps.session, atermString: JSON.stringify(nextProps.session['selected_aterms']), flat:true
    });

  }
  shouldComponentUpdate(nextProps, nextState){
    if(JSON.stringify(nextProps.session['selected_aterms']) === this.state.atermString && this.state.flat===true) {
      if(this.props.update){ return true;}
      else {return false;}
    }
    return true;
  }

  addATerm(term){
    var terms= this.state.atermString.substring(1,this.state.atermString.length-1).split(",");
    if(terms.includes(term)){
	this.props.removeQueryTag(5, term);
    }
    else{
	this.props.addATerm(term);
    }
  }

  render(){
      if(this.state.currentATerms!==undefined){
	  // Sorting the terms by Postive or Negative so that all Positive are consecutive
	  // and all Negative are consecutive
	  // Create items array from the currentATerms term and tag dict
	  var items = Object.keys(this.state.currentATerms).map((key)=>{
	      return [key, this.state.currentATerms[key]['tag']];
	  });

	  // Sort the array based on the tag element
	  items.sort(function(first, second) {
	      // Since tags can be "Positive", "Negative","Positive;Custom" or "Negative;Custom"
	      var tag1 = "Positive";
	      var tag2 = "Positive";
	      if(first[1].indexOf("Positive") < 0)
		  tag1="Negative";
	      if(second[1].indexOf("Positive") < 0)
		  tag2="Negative";

	      //Sort by Positive first and then Negative
	      if (tag1===tag2)
		  return 0;
	      if (tag1<tag2)
		  return 1;
	      return -1;
	  });
	  
      return(
        <div>
        {items.map((item, index)=>{
	    var term = item[0];
	    var tag = item[1];
            var labelTerms=  term; //Annotated terms extracted from the context or user specified
            var checkedTerm=false;
            var terms = this.state.atermString.substring(1,this.state.atermString.length-1).split(",");
            if(terms.includes(term))
		checkedTerm=true;
	    var termColor="red";
	    if(tag.indexOf("Positive") >=0)
		termColor = "blue";
	    return <Checkbox label={labelTerms} labelStyle={{color: termColor}} checked={checkedTerm} style={styles.checkbox}  onClick={this.addATerm.bind(this,term)}/>;
        })}
        </div>
      );
    }
    return(
      <CircularProgressSimple />
    );
  }

}

class LoadTag extends React.Component {
  constructor(props){
    super(props);
    this.state={
      tagsCheckBox:[],
      tagString:undefined,
      session: {},
      flat:false,
    };
  }

  componentWillMount(){
    $.post(
      '/getAvailableTags',
      {'session': JSON.stringify(this.props.session), 'event': 'Tags'},
      function(tagsDomain) {
        this.setState({currentTags: tagsDomain['tags'], session:this.props.session, tagString: JSON.stringify(this.props.session['selected_tags'])});
      }.bind(this)
    );
  }

  componentWillReceiveProps(nextProps){
    if(JSON.stringify(nextProps.session['selected_tags']) === this.state.tagString ) {
      this.setState({ flat:true});
      return;
    }
    this.setState({
      session:nextProps.session, tagString: JSON.stringify(nextProps.session['selected_tags']), flat:false
    });

  }

  shouldComponentUpdate(nextProps){
    if(JSON.stringify(nextProps.session['selected_tags']) === this.state.tagString && this.state.flat===true ) {
      if(this.props.update){return true;}
      else {return false;}
    }
    return true;
  }

  addTags(tag){

    var tags = this.state.tagString.substring(1,this.state.tagString.length-1).split(",");
    if(tags.includes(tag)){
      this.props.removeQueryTag(1, tag);
    }
    else{
      this.props.addTags(tag);
    }
  }

  render(){
    if(this.state.currentTags!==undefined){
      return(
        <div style={styles.headline}>
        {Object.keys(this.state.currentTags).map((tag, index)=>{
          var labelTags=  tag+" " +"(" +this.state.currentTags[tag]+")";
          var checkedTag=false;
          var tags = this.state.tagString.substring(1,this.state.tagString.length-1).split(",");
          if(tags.includes(tag))
            checkedTag=true;
          return <Checkbox label={labelTags} checked={checkedTag} style={styles.checkbox}  onClick={this.addTags.bind(this,tag)} />
        })}
        </div>
      );
    }
    return(
      <CircularProgressSimple />
    );
  }
}

class LoadModel extends React.Component {
  constructor(props){
    super(props);
    this.state={
      modelTagCheckBox:[],
      modelTagString:undefined,
      session: {},
      flat:false,
    };
  }

  componentWillMount(){
    $.post(
      '/getAvailableModelTags',
      {'session': JSON.stringify(this.props.session)},
      function(modelTagDomain) {
        this.setState({currentModelTags: modelTagDomain, session:this.props.session, modelTagString: JSON.stringify(this.props.session['selected_model_tags'])});
      }.bind(this)
    );
  }

  componentWillReceiveProps(nextProps){
    if(JSON.stringify(nextProps.session['selected_model_tags']) === this.state.modelTagString ) {
      this.setState({ flat:true});
      return;
    }
    this.setState({
      session:nextProps.session, modelTagString: JSON.stringify(nextProps.session['selected_model_tags']), flat:false
    });

  }

  shouldComponentUpdate(nextProps){
    if(JSON.stringify(nextProps.session['selected_model_tags']) === this.state.modelTagString && this.state.flat===true ) {
      if(this.props.update){return true;}
      else {return false;}
    }
    return true;
  }

  addModelTags(tag){

    var tags = this.state.modelTagString.substring(1,this.state.modelTagString.length-1).split(",");
    if(tags.includes(tag)){
      this.props.removeQueryTag(3, tag);
    }
    else{
      this.props.addModelTags(tag);
    }
  }

  render(){
    if(this.state.currentModelTags!==undefined){
      return(
        <div style={styles.headline}>
        {Object.keys(this.state.currentModelTags).map((tag, index)=>{
          var labelTags=  tag+" " +"(" +this.state.currentModelTags[tag]+")";
          var checkedTag=false;
          var tags = this.state.modelTagString.substring(1,this.state.modelTagString.length-1).split(",");
          if(tags.includes(tag))
            checkedTag=true;
          return <Checkbox label={labelTags} checked={checkedTag} style={styles.checkbox}  onClick={this.addModelTags.bind(this,tag)} />
        })}
        </div>
      );
    }
    return(
      <CircularProgressSimple />
    );
  }
}


class FiltersTabs extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      slideIndex: 0,
      currentQueries:undefined,
      currentTags:undefined,
      currentModels:undefined,
      currentATerms:undefined,
      queriesCheckBox:[],
      tagsCheckBox:[],
      sessionString:"",
      session: {},
      queryString:"",
      tldString:"",
      atermString:"",		
      tagString:"",
      modelTagString:"",
      flat:false,
    };
  }

  componentWillMount(){
    this.setState({session:this.props.session, sessionString: JSON.stringify(this.props.session), queryString: JSON.stringify(this.props.session['selected_queries']),tldString: JSON.stringify(this.props.session['selected_tlds']),atermString: JSON.stringify(this.props.session['selected_aterms']), tagString: JSON.stringify(this.props.session['selected_tags']) });

  }

  componentWillReceiveProps(nextProps) {
    if(JSON.stringify(nextProps.session) === this.state.sessionString) {
      this.setState({  flat: true });
        return;
    }
    this.setState({
        session:nextProps.session, sessionString: JSON.stringify(nextProps.session), queryString: JSON.stringify(nextProps.session['selected_queries']), tldString: JSON.stringify(this.props.session['selected_tlds']),atermString: JSON.stringify(this.props.session['selected_aterms']), tagString: JSON.stringify(nextProps.session['selected_tags']), flat: true
    });

  }

  handleChange = (value) => {
    this.setState({
      slideIndex: value,
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    if(this.props.update || JSON.stringify(nextProps.session) !== this.state.sessionString || nextState.slideIndex !== this.state.slideIndex) {
          return true;
    }
    return false;
  }

    addQuery(labelQuery){
	console.log("CHECKED QUERY 1 "+labelQuery);
    var selected_queries=[];
    if(this.state.queryString.substring(1,this.state.queryString.length-1)!="")
      selected_queries = this.state.queryString.substring(1,this.state.queryString.length-1).split(",");
    selected_queries.push(labelQuery);
    var newQuery = selected_queries.toString();
    this.setState({queriesCheckBox: selected_queries});
    var sessionTemp = this.props.session;
    if(sessionTemp['selected_tags']!=="" || sessionTemp['selected_tlds']!=="" || sessionTemp['selected_aterms']!==""){
	sessionTemp['newPageRetrievalCriteria'] = "Multi";
	sessionTemp['pageRetrievalCriteria'] = {"query":newQuery};
	if(sessionTemp['selected_tags']!=="")
	    sessionTemp['pageRetrievalCriteria']['tag'] = sessionTemp['selected_tags'];
	if(sessionTemp['selected_tlds']!=="")
	    sessionTemp['pageRetrievalCriteria']['domain'] = sessionTemp['selected_tlds'];
	if(sessionTemp['selected_aterms']!=="")
	    sessionTemp['filter'] = sessionTemp['selected_aterms'];
    }
    else{
	sessionTemp['newPageRetrievalCriteria'] = "one";
	sessionTemp['pageRetrievalCriteria'] = "Queries";
    }
    sessionTemp['selected_queries']=newQuery;
    this.props.updateSession(sessionTemp);
  }

  addTLD(labelTLD){
    var selected_tlds=[];
    if(this.state.tldString.substring(1,this.state.tldString.length-1)!="")
      selected_tlds = this.state.tldString.substring(1,this.state.tldString.length-1).split(",");
    selected_tlds.push(labelTLD);
    var newTLDs = selected_tlds.toString();
    this.setState({queriesCheckBox: selected_tlds});
    var sessionTemp = this.props.session;
    if(sessionTemp['selected_queries']!=="" || sessionTemp['selected_tags']!==""){
	sessionTemp['newPageRetrievalCriteria'] = "Multi";
	sessionTemp['pageRetrievalCriteria'] = {'domain':newTLDs};
	if(sessionTemp['selected_queries']!=="")
	    sessionTemp['pageRetrievalCriteria']['query'] = sessionTemp['selected_queries'];
	if(sessionTemp['selected_tags']!=="")
	    sessionTemp['pageRetrievalCriteria']['tag'] = sessionTemp['selected_tags'];
    }
    else{
	sessionTemp['newPageRetrievalCriteria'] = "one";
	sessionTemp['pageRetrievalCriteria'] = "TLDs";
    }
    sessionTemp['selected_tlds']=newTLDs;
    this.props.updateSession(sessionTemp);
  }

  addATerm(labelTerm){
    var selected_aterms=[];
    if(this.state.atermString.substring(1,this.state.atermString.length-1)!="")
      selected_aterms = this.state.atermString.substring(1,this.state.atermString.length-1).split(",");
    selected_aterms.push(labelTerm);
    var newTerms = selected_aterms.toString();
    this.setState({queriesCheckBox: selected_aterms});
    var sessionTemp = this.props.session;
    if(sessionTemp['selected_queries']!=="" || sessionTemp['selected_tags']!=="" || sessionTemp['selected_tlds']!==""){
	sessionTemp['newPageRetrievalCriteria'] = "Multi";
	sessionTemp['filter'] = labelTerm;
	sessionTemp['pageRetrievalCriteria'] = {}
	if (sessionTemp['selected_tlds']!=="")
	    sessionTemp['pageRetrievalCriteria']['domain'] = sessionTemp['selected_tlds'];
	if(sessionTemp['selected_queries']!=="")
	    sessionTemp['pageRetrievalCriteria']['query'] = sessionTemp['selected_queries'];
	if(sessionTemp['selected_tags']!=="")
	    sessionTemp['pageRetrievalCriteria']['tag'] = sessionTemp['selected_tags'];
    }
    else{
	sessionTemp['filter']=labelTerm
    }
    sessionTemp['selected_aterms']=newTerms;
    this.props.updateSession(sessionTemp);
  }
    
  addTags(labelTags){
    var selected_tags=[];
    if(this.state.tagString.substring(1,this.state.tagString.length-1)!="")
	selected_tags = this.state.tagString.substring(1,this.state.tagString.length-1).split(",");
    selected_tags.push(labelTags);
    var newTags = selected_tags.toString();
    this.setState({tagsCheckBox: selected_tags});
    var sessionTemp = this.props.session;
    if(sessionTemp['selected_queries']!=="" || sessionTemp['selected_tlds']!==""){
	sessionTemp['newPageRetrievalCriteria'] = "Multi";
	sessionTemp['pageRetrievalCriteria'] = {'tag':newTags};
	if(sessionTemp['selected_queries']!=="")
	    sessionTemp['pageRetrievalCriteria']['query'] = sessionTemp['selected_queries'];
	if(sessionTemp['selected_tlds']!=="")
	    sessionTemp['pageRetrievalCriteria']['domain'] = sessionTemp['selected_tlds'];
    }
    else{
	sessionTemp['newPageRetrievalCriteria'] = "one";
	sessionTemp['pageRetrievalCriteria'] = "Tags";
    }

    sessionTemp['selected_tags']=newTags;
    this.props.updateSession(sessionTemp);
  }

  addModelTags(labelModelTags){
    var selected_modeltags=[];
    if(this.state.modelTagString.substring(1,this.state.modelTagString.length-1)!="")
      selected_modeltags = this.state.modelTagString.substring(1,this.state.modelTagString.length-1).split(",");
    selected_modeltags.push(labelModelTags);
    var newTags = selected_modeltags.toString();
    this.setState({tagsCheckBox: selected_modeltags});
    var sessionTemp = this.props.session;
    if(sessionTemp['selected_queries']!=="" || sessionTemp['selected_tlds']!==""){
	sessionTemp['newPageRetrievalCriteria'] = "Multi";
	sessionTemp['pageRetrievalCriteria'] = {'tag':newTags};
	if(sessionTemp['selected_queries']!=="")
	    sessionTemp['pageRetrievalCriteria']['query'] = sessionTemp['selected_queries'];
	if(sessionTemp['selected_tlds']!=="")
	    sessionTemp['pageRetrievalCriteria']['domain'] = sessionTemp['selected_tlds'];
    }
    else{
	sessionTemp['newPageRetrievalCriteria'] = "one";
	sessionTemp['pageRetrievalCriteria'] = "Model Tags";
    }
    sessionTemp['selected_model_tags']=newTags;
    this.props.updateSession(sessionTemp);
  }

  removeString(currentType, item){
    var currentString = "";
    var array=[]; // it could be a query or tag array.
    switch (currentType) {
      case 0: //query
          array = this.state.queryString.substring(1,this.state.queryString.length-1).split(",");
          break;
      case 1://tags
          array = this.state.tagString.substring(1,this.state.tagString.length-1).split(",");
        break;
      case 2: //tlds
        array = this.state.tldString.substring(1,this.state.tldString.length-1).split(",");
        break;
      case 3: //Annotated Terms
        array = this.state.atermString.substring(1,this.state.atermString.length-1).split(",");
        break;
    }
    for(var index in array){ /* loop over all array items */
      if(array[index] !== item){
        currentString = currentString + array[index] + ",";
      }
    }
    if(currentString != "") return currentString.substring(0, currentString.length-1);
    return currentString;
  }

  removeQueryTag(currentType, item){
    const sessionTemp =  this.state.session;
    switch (currentType) {
      case 0: //query
          sessionTemp['selected_queries']= this.removeString(0, item);
          if(sessionTemp['selected_queries'] === "") {
            sessionTemp['newPageRetrievalCriteria'] = "one";
            sessionTemp['pageRetrievalCriteria'] = "Tags";
          }
          break;
      case 1://tags
          sessionTemp['selected_tags']= this.removeString(1, item);
          if(sessionTemp['selected_tags'] === "") {
            sessionTemp['newPageRetrievalCriteria'] = "one";
            sessionTemp['pageRetrievalCriteria'] = "Queries";
          }
          break;
      case 3://tags
          sessionTemp['selected_model_tags']= this.removeString(3, item);
          if(sessionTemp['selected_model_tags'] === "") {
            if(sessionTemp['selected_queries'] !== "" && sessionTemp['selected_tags'] !== "")
                sessionTemp['newPageRetrievalCriteria'] = "Multi";
            else if (sessionTemp['selected_queries'] !== "") {
              sessionTemp['newPageRetrievalCriteria'] = "one";
              sessionTemp['pageRetrievalCriteria'] = "Queries";
            }
            else {
              sessionTemp['newPageRetrievalCriteria'] = "one";
              sessionTemp['pageRetrievalCriteria'] = "Tags";
            }
          }
        break;
      case 4: //TLD
          sessionTemp['selected_tlds']= this.removeString(2, item);
          if(sessionTemp['selected_tlds'] === "") {
            sessionTemp['newPageRetrievalCriteria'] = "one";
            sessionTemp['pageRetrievalCriteria'] = "TLDs";
          }
        break;
      case 5: //Annotated Terms
          sessionTemp['selected_aterms']= this.removeString(3, item);
          break;
    }

    if(sessionTemp['selected_queries'] === "" && sessionTemp['selected_tags'] === "" && sessionTemp['selected_model_tags'] === "" && sessionTemp['selected_tlds'] === "" && sessionTemp['selected_aterms'] === ""){
       sessionTemp['pageRetrievalCriteria'] = "Most Recent";
    }
    this.props.deletedFilter(sessionTemp);
  }
/*
  createCheckbox(k, index){
    var labelQuery=  k+" " +"(" +index+")";
    return <Checkbox
    label={labelQuery}
    style={styles.checkbox}
    onClick={this.addQuery.bind(this,k )} />;

    return <Checkbox
              label={label}
              handleCheckboxChange={this.toggleCheckbox}
              key={label} />;
  }

  createImages(currentQueries) {
     return Object.keys(currentQueries).map(this.createImage);
   },
*/

  render() {
    console.log("--------FiltersTabs---------");
    return (
      <div>
        <Tabs
          onChange={this.handleChange}
          value={this.state.slideIndex}
          inkBarStyle={{background:'#7940A0' ,height: '4px'}}
          tabItemContainerStyle={{background: '#9A7BB0' ,height: '40px'}}
        >
          <Tab label="Queries" value={0} style={styles.tab} />
            <Tab label="Tags" value={1} style={styles.tab} />
            <Tab label="Domains" value={2} style={styles.tab} />
          <Tab label="LTerms" value={3} style={styles.tab} />	    	    
          <Tab label="Model" value={4} style={styles.tab} />
        </Tabs>
        <SwipeableViews index={this.state.slideIndex} onChangeIndex={this.handleChange}  >
          <div style={styles.headline}>
            <LoadQueries update={this.props.update} session={this.state.session} addQuery={this.addQuery.bind(this)} removeQueryTag={this.removeQueryTag.bind(this)}  />
          </div>
          <div style={styles.headline}>
            <LoadTag session={this.state.session} addTags={this.addTags.bind(this)} removeQueryTag={this.removeQueryTag.bind(this)}/>
            </div>
          <div style={styles.headline}>
            <LoadTLDs session={this.props.session} addTLD={this.addTLD.bind(this)} removeQueryTag={this.removeQueryTag.bind(this)}  />
          </div>
          <div style={styles.headline}>
            <LoadAnnotatedTerms session={this.props.session} addATerm={this.addATerm.bind(this)} removeQueryTag={this.removeQueryTag.bind(this)}  />
          </div>
          <div style={styles.headline}>
            <LoadModel session={this.state.session} addModelTags={this.addModelTags.bind(this)}/>
          </div>
        </SwipeableViews>
      </div>
    );
  }
}

export default FiltersTabs;
