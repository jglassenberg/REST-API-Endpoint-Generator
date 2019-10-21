    //TODO:
    // add handler for whether it's just the models or the rest of the function
    // Add request bodies if they exist in the schema
    // Add function to add all response codes
    // Add better handler for YAML to JSON conversion
    // Add #Comments for YAML return
    // Handle jsYaml dependency


    //Sorting of output
    //Add YAML handler in site

/*********************************

Global Variables

*********************************/

//Set when REST functions are being defined. Stores the scopes to be reused across parameters.
//var scopes = {};


/********************************

Helper functions for strings and query parameters.

********************************/

/*
Obtain the GET parameters to auto-add functions from URL requests
Parameters:
- parameterName: the name of a parameter expected in a query
Returns:
- The value of the parameter
- Null if the parameter doesn't exist.
*/
function findGetParameter(parameterName) {
    var result = null,
        tmp = [];
    location.search
        .substr(1)
        .split("&")
        .forEach(function (item) {
          tmp = item.split("=");
          if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
        });
    return result;
} 
    
/*
Takes a component and create a plural version of it for descriptions. Appended to strings.
Returns:
- A plural version of the word.
https://stackoverflow.com/questions/27194359/javascript-pluralize-a-string
http://jsfiddle.net/pmrotule/dyhxdd44/17/
*/    
String.prototype.plural = function(revert){

    var plural = {
        '(quiz)$'               : "$1zes",
        '^(ox)$'                : "$1en",
        '([m|l])ouse$'          : "$1ice",
        '(matr|vert|ind)ix|ex$' : "$1ices",
        '(x|ch|ss|sh)$'         : "$1es",
        '([^aeiouy]|qu)y$'      : "$1ies",
        '(hive)$'               : "$1s",
        '(?:([^f])fe|([lr])f)$' : "$1$2ves",
        '(shea|lea|loa|thie)f$' : "$1ves",
        'sis$'                  : "ses",
        '([ti])um$'             : "$1a",
        '(tomat|potat|ech|her|vet)o$': "$1oes",
        '(bu)s$'                : "$1ses",
        '(alias)$'              : "$1es",
        '(octop)us$'            : "$1i",
        '(ax|test)is$'          : "$1es",
        '(us)$'                 : "$1es",
        '([^s]+)$'              : "$1s"
    };

    var singular = {
        '(quiz)zes$'             : "$1",
        '(matr)ices$'            : "$1ix",
        '(vert|ind)ices$'        : "$1ex",
        '^(ox)en$'               : "$1",
        '(alias)es$'             : "$1",
        '(octop|vir)i$'          : "$1us",
        '(cris|ax|test)es$'      : "$1is",
        '(shoe)s$'               : "$1",
        '(o)es$'                 : "$1",
        '(bus)es$'               : "$1",
        '([m|l])ice$'            : "$1ouse",
        '(x|ch|ss|sh)es$'        : "$1",
        '(m)ovies$'              : "$1ovie",
        '(s)eries$'              : "$1eries",
        '([^aeiouy]|qu)ies$'     : "$1y",
        '([lr])ves$'             : "$1f",
        '(tive)s$'               : "$1",
        '(hive)s$'               : "$1",
        '(li|wi|kni)ves$'        : "$1fe",
        '(shea|loa|lea|thie)ves$': "$1f",
        '(^analy)ses$'           : "$1sis",
        '((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$': "$1$2sis",        
        '([ti])a$'               : "$1um",
        '(n)ews$'                : "$1ews",
        '(h|bl)ouses$'           : "$1ouse",
        '(corpse)s$'             : "$1",
        '(us)es$'                : "$1",
        's$'                     : ""
    };

    var irregular = {
        'move'   : 'moves',
        'foot'   : 'feet',
        'goose'  : 'geese',
        'sex'    : 'sexes',
        'child'  : 'children',
        'man'    : 'men',
        'tooth'  : 'teeth',
        'person' : 'people'
    };

    var uncountable = [
        'sheep', 
        'fish',
        'deer',
        'moose',
        'series',
        'species',
        'money',
        'rice',
        'information',
        'equipment'
    ];

    // save some time in the case that singular and plural are the same
    if(uncountable.indexOf(this.toLowerCase()) >= 0)
      return this;

    // check for irregular forms
    for(word in irregular){

      if(revert){
              var pattern = new RegExp(irregular[word]+'$', 'i');
              var replace = word;
      } else{ var pattern = new RegExp(word+'$', 'i');
              var replace = irregular[word];
      }
      if(pattern.test(this))
        return this.replace(pattern, replace);
    }

    if(revert) var array = singular;
         else  var array = plural;

    // check for matches using regular expressions
    for(reg in array){

      var pattern = new RegExp(reg, 'i');

      if(pattern.test(this))
        return this.replace(pattern, array[reg]);
    }

    return this;
}

/**********************************************************************

Functions to add Components

**********************************************************************/

/*
This appends query parameters to the component definition of the OpenAPI schema.
Parameters:
- finalObj: the JSON object representing the OpenAPI schema
Returns:
- Adds a Tag section to the finalObj JSON data
*/    
function addTagComponents(finalObj){
    
    var myObj = finalObj;
    
    var i = 0;
	
    for(var x of Object.keys(myObj.components.schemas)) {
        // Go through each component and create a tag for each name
        var description = "";
        if (myObj.components.schemas[x].description) description = myObj.components.schemas[x].description;
        finalObj.tags[i++]= {
		  "name": x,
		  "description": description,
          "externalDocs": {
              "description":"",
		      "url":""
          } 
	   };        

    }
        
}
            
/*
This appends query parameters to the component definition of the OpenAPI schema.
Parameters:
- finalObj: the JSON object representing the OpenAPI schema
Returns:
- Adds search parameters to the finalObj JSON object
*/    
function addSearchComponents(finalObj){
    
    finalObj.components.parameters["Query"]= {
		"name": "q",
		"in": "query",
		"description": "main query parameter",
		"required": false,
		"type": "string"
	};
	finalObj.components.parameters["Sort"]=  {
		"name": "sortBy",
		"in": "query",
		"description": "main sort parameter",
		"required": false,
		"type": "string",
		"enum": [ //TODO: this needs to be adjusted
			"title.asc",
			"title.desc",
			"date.asc",
			"date.desc"
		]
	};
        
	finalObj.components.parameters["Filter"]=  {
		"name": "filter",
		"in": "query",
		"description": "Base filter",
		"required": false,
        "schema": {
            "type":"object",
            "properties":{
                "example1":{
                    "type":"string",
                    "description":"Fill this in with a filter property"
                },
                "example2":{
                    "type":"string",
                    "description":"Fill this in with a filter property"
                }
            }
            
        }
	};
        
    
}
   

/*
This appends pagination parameters to the component definition of the OpenAPI schema.
Parameters:
- finalObj: the JSON object representing the OpenAPI schema
- paginationType: A string representing different pagination options. Can be "Limit-Offset" or "Next-Prev".  
Returns:
- Adds pagination parameters to the finalObj JSON object
*/
function addPaginationSchemas(finalObj, paginationType){
    
    if (paginationType == "Limit-Offset"){
        finalObj.components.parameters["Limit"]= {
		  "name": "size",
		  "in": "query",
		  "description": "Amount of records to return",
		  "required": false,
		  "type": "integer",
		  "format": "int32",
          "minimum": 1,
          "maximum": 50,
		  "default": 20
	   };
	   finalObj.components.parameters["Offset"]= {
		  "name": "offset",
		  "in": "query",
		  "description": "Page number in the search to return",
		  "required": false,
		  "type": "integer",
		  "format": "int32",
          "minimum": 0,
		  "default": 20
	   };
    }
    else if (paginationType == "Next-Prev"){
        finalObj.components.parameters["Limit"]= {
		  "name": "limit",
		  "in": "query",
		  "description": "Amount of records to return",
		  "required": false,
		  "type": "integer",
		  "format": "int32",
          "minimum": 1,
          "maximum": 50,
		  "default": 20
	   };
	   finalObj.components.parameters["StartingAfter"]= {
		  "name": "starting_after",
		  "in": "query",
		  "description": "The Object ID from which to continue obtaining items from the list",
		  "required": false,
		  "type": "integer",
		  "format": "uuid",
	   };
       finalObj.components.parameters["EndingBefore"]= {
		  "name": "ending_before",
		  "in": "query",
		  "description": "The Object ID from which to definitely end the list segment",
		  "required": false,
		  "type": "integer",
		  "format": "uuid",
	   };
    }
    
}

/*
This appends security parameters to the component definition of the OpenAPI schema.
Parameters:
- finalObj: the JSON object representing the OpenAPI schema
- securityTypes: An array of the security schemes that should be included in this OpenAPI schema
Returns:
- Adds Security schemes to the finalObj JSON object. 

Note that security parameters may apply to individual functions. That is added separately, in each of the CRUD functions.
*/
function addSecuritySchemes(finalObj, securityTypes){
    
    
    
    if (!finalObj.security){
        finalObj.security = new Array();
    }
    
    //The developer may have selected several components to define in the schema, so we loop through all they chose.
    for (var i =0; i<securityTypes.length; i++) {
        if (securityTypes[i] == "ApiKeyAuth"){
            finalObj.components.securitySchemes["ApiKeyAuth"]= {
                "type": "apiKey",
                "name": "X-API-Key",
                "in": "header"
            };
            finalObj.security[finalObj.security.length] = {
                "ApiKeyAuth":[]
            };
        }
        else if (securityTypes[i] == "BasicAuth"){
            finalObj.components.securitySchemes["BasicAuth"]= {
                "type": "http",
                "scheme": "basic",
            };
        } 
        else if (securityTypes[i] == "BearerAuth"){
            finalObj.components.securitySchemes["BearerAuth"]= {
                "type": "http",
                "scheme": "bearer",
                "bearerFormat":"JWT"
            };
        } 
        else if (securityTypes[i] == "OpenID"){
            finalObj.components.securitySchemes["OpenID"]= {
                "type": "openIdConnect",
                "openIdConnectUrl:": "https://www.enterOpenIdUrlHere.com",
            };
        } 
        else if (securityTypes[i] == "Oauth2"){
            
            //Obtain the scopes to apply to Oauth
            var scopes = getScopes(finalObj);
        
            finalObj.components.securitySchemes["Oauth2"]= {
                "type": "oauth2",
                "flows": {
                    "implicit": {
                        "authorizationUrl": "http://example.org/api/oauth/dialog",
                        "scopes": scopes
                    }
                }
            };
            
            finalObj.security[finalObj.security.length] = {
                "Oauth2": scopes
                
            };
        }
    }
    
}

/*
Appends a standard Error schema to possible response objects.
Parameters:
- finalObj: the JSON object representing the OpenAPI schema
Returns:
- Adds the Error schema to the finalObj JSON object. It's one of the component schemas.  
Note that the errror object is frequently referenced in functions. This is established in each of the CRUD definition functions.
*/    
function addErrorSchema(finalObj){
    
    var myObj = finalObj;
    
    var i = 0;
	
    //Create a standard Error schema
    finalObj.components.schemas["Error"]= {
        "type": "object",
        "properties": {
            "code":{
                "type":"string"   
            },
            "message":{
                "type":"string"
            },
            "required":[
                "code",
                "message"
            ]
        }
    };
    
    if (!finalObj.components.responses){
        finalObj.components.responses = {};   
    }
    
    //Create standard error responses
    finalObj.components.responses["NotFound"]= {
        "description": "The specified resource was not found",
        "content":{
            "application/json":{
                "schema":{
                    "$ref":"#/components/schemas/Error"   
                }
            }
        }
    };
    
    finalObj.components.responses["Unauthorized"]= {
        "description": "Unauthorized",
        "content":{
            "application/json":{
                "schema":{
                    "$ref":"#/components/schemas/Error"   
                }
            }
        }
    };
    
    //TODO: add other common error responses
        
}

/*******************************************************************

Functions to add extra parameters to function calls

Note that these functions do not modify the finalObj parameter as the prior functions do.

*******************************************************************/


/*
Obtains the scopes for security components in the security scheme
Parameters:
- finalObj: the JSON object representing the OpenAPI schema
Returns:
- A list of scopes that can be added to a chema. 
*/ 
function getScopes(finalObj){
     
     var scopes =[{}];
     var i=0;
            
     for(var x of Object.keys(finalObj.components.schemas)) {
          // Go through each model and create functions from the names
       
          //Add functions for for the key CRUD operations.
          // GET list, POST, GET specific item, PUT & PATCH item, and Delete item
         //Depending on whether this is to create a component or a parameter, return everything or only the component
            scopes[0]["read:"+x.plural()] = "description";
            scopes[0]["write:"+x.plural()] = "description";
     }
    
    scopes = scopes [0];
    return scopes;
    
}

/*
Obtains the scopes for security parameters
Parameters:
- finalObj: the JSON object representing the OpenAPI schema
- component: The component for which CRUD paths are being defined.  For that path, we will only apply scopes of the component.
Returns:
- A list of scopes that can be added to a security defintion for a particular API endpoint. 
*/ 
function getScopeParameters(finalObj, component){
     var scopes = new Array();
     var i=0;
            
     for(var x of Object.keys(finalObj.components.schemas)) {
          // Go through each model and create functions from the names
       
          //Add functions for for the key CRUD operations.
          // GET list, POST, GET specific item, PUT & PATCH item, and Delete item
         //Depending on whether this is to create a component or a parameter, return everything or only the component
         if ( (!component) || (component==x) ) {
            scopes[i++] ="read:"+x.plural(); 
            scopes[i++] = "write:"+x.plural();
         }
            
         
        
     }
    //scopes = scopes [0];
    return scopes;
    
}


/*
Provides query parameters that can be added to relevant functions.  It returns a string and takes no parameters.
Parameters:
- N/A.  We assume only one type of search parameter. In the future, we may provide an optional parameter to choose different parameter structures here.
Returns:
- A list search parameters 
*/ 
function getSearchParameters(){
 /*var queryParams = [ {
          "name" : "q",
          "in" : "query",
          "description" : "Basic search filter for the list",
          "required" : false,
          "explode" : true,
          "schema" : {
            "type" : "object",
            "$ref" : "#/components/schemas/Query"
          }
        },
        {
        "name" : "sort",
          "in" : "query",
          "description" : "Basic sort parameter for the list",
          "required" : false,
          "explode" : true,
          "schema" : {
            "type" : "object",
            "$ref" : "#/components/schemas/Sort"
          }
        },
        {
        "name" : "filter",
          "in" : "query",
          "description" : "Basic filter parameter for the list",
          "required" : false,
          "explode" : true,
          "schema" : {
            "type" : "object",
            "$ref" : "#/components/schemas/Filter"
          }
        }
      ];  */
    
    var searchParams = [
        {
            "$ref" : "#/components/parameters/Query"
        },
        {
            "$ref" : "#/components/parameters/Sort"
        },
        {
            "$ref" : "#/components/parameters/Filter"
        }
    ]
    return searchParams;
}
    

 
//TODO: Mage a "get" not "Add"
/*
Provides pagination parameters to the component definition of the OpenAPI schema.
Parameters:
- paginationType: A string representing the choice of pagination method to apply to the CRUD paths. Can be "Limit-Offset" or "Prev-Next"
Returns
- A list of pagination parameters to add as parameters to a CRUD path.
*/ 
function getPaginationParameters(paginationType){
    //alert(paginationType);
    
    if (paginationType == "Limit-Offset"){
       /* var paginationParams = [ {
            "name" : "limit",
            "in" : "query",
            "description" : "The maximum number of items to return in one request",
            "required" : false,
            "type":"integer"
          },
          {
            "name" : "offset",
            "in" : "query",
            "description" : "The 'page number' to obtain with each section of length of limit",
            "required" : false,
            "type":"integer"
          }
        ];   */
        
        var paginationParams = [
            {
                "$ref":"#/components/parameters/Limit"
            },
            {
                "$ref":"#/components/parameters/Offset"
            }
        ];
        return paginationParams;
    }
    else if (paginationType == "Next-Prev"){
       /* var paginationParams = [ {
            "name" : "limit",
            "in" : "query",
            "description" : "The maximum number of items to return in one request",
            "required" : false,
            "type":"integer"
          },
          {
            "name" : "starting_after",
            "in" : "query",
            "description" : "The Object ID from which to continue obtaining items from the list",
            "required" : false,
            "type":"integer",
            "format":"uuid"
          },
          {
            "name" : "ending_before",
            "in" : "query",
            "description" : "The Object ID from which to continue obtaining items from the list",
            "required" : false,
            "type":"integer",
            "format":"uuid"
          }
        ]; */
        
        var paginationParams = [ 
            {
                "$ref":"#/components/parameters/Limit",
            },
            {
                "$ref":"#/components/parameters/StartingAfter"
            },
            {
                "$ref":"#/components/parameters/EndingBefore"
            }
        ];
        return paginationParams;
        
        
    }
    
    return new Array();
}
    


/*
Provides security parameters for a CRUD function.  This includes the scopes if Oauth2, but also other properties chosen.
Parameters:
- finalObj: the JSON object representing the OpenAPI schema
- securityTypes: a list of security schemes chosen for this API
- component: The component for which CRUD paths are being defined.  For that path, we will only apply scopes of the component.
- A list of pagination parameters to add as parameters to a CRUD path.
*/ 
function getSecurityParameters(finalObj, securityTypes, component){
    var securityParameters = [];
    
    for (var i =0; i< securityTypes.length; i++) {
        if (securityTypes[i] == "ApiKeyAuth"){
            securityParameters[securityParameters.length] = {};
            securityParameters[securityParameters.length-1]["ApiKeyAuth"] = [];
        }
        else if (securityTypes[i] == "BasicAuth"){
            //We don't add this to the functions by default.  Only API Keys and Oauth.
        } 
        else if (securityTypes[i] == "BearerAuth"){
            securityParameters[securityParameters.length] = {};
            securityParameters[securityParameters.length-1]["bearerAuth"] = [];
        } 
        else if (securityTypes[i] == "OpenID"){
            //We don't add this to the functions by default.  Only API Keys and Oauth.

        } 
        else if (securityTypes[i] == "Oauth2"){
            
            //Define scopes via loop
            var scopes = getScopeParameters(finalObj, component);
            
            securityParameters[securityParameters.length] = {};
            securityParameters[securityParameters.length-1]["Oauth2"]=scopes;
            
        }
    }
    return securityParameters;
}


/***************************************************************

Functions to provide content of CRUD endpoints.

****************************************************************/


/*
provides the GET function for the list of compontent endpoint.
Parameters:
- name: the name of the path (singular form of the component schema)
- hasQueryParams: boolean. Whether the endpoint should have query (search and filter) parameters
- paginationParams: The type of pagination metho to apply to the list.  Is Null if no pagination is chosen.
- securityParameters: Array. The list of security parameters to apply to the endpoint
Returns:
- A CRUD function in JSON that can be added to an Open API JSON object.
*/ 
function setGetList(name, hasQueryParams, paginationParams, securityParameters){
    
    var queryParams = getPaginationParameters(paginationParams);
    var plural=name.plural();
    
    if (hasQueryParams){
       queryParams = queryParams.concat(getSearchParameters());
    }
    
    
    var getList = {
      "get" : {
        "tags" : [ name ],
        "summary" : "List of "+plural,
        "description" : "List of "+plural+".",
        "operationId" : "get"+plural,
        "security" : securityParameters,
        "parameters" : queryParams,
        "responses" : {
          "200" : {
            "description" : "successful operation",
            "content" : {
              "application/json" : {
                "schema" : {
                  "type" : "array",
                  "items" : {
                    "$ref" : "#/components/schemas/"+name
                  }
                }
              },
            }
          },
          "401" : {
            "$ref" : "#/components/responses/Unauthorized"
          },
          "default" : {
            "$ref" : "#/components/schemas/Error"
          }
        },
      }
    };
    
    return getList;
}


/*
Provides the GET function for the list of a component under another component 
Example: files/{id}/tags
Parameters:
- name: the name of the path (singular form of the component schema)
- subname: the name of the sub-object of the endpoint (like 'tags' in the example)
- ref: the reference path of the component schema to the subendpoint.  A deprecated parameter that's not in use.
- hasQueryParams: boolean. Whether the endpoint should have query (search and filter) parameters
- paginationParams: The type of pagination metho to apply to the list.  Is Null if no pagination is chosen.
- securityParameters: Array. The list of security parameters to apply to the endpoint
Returns:
- A CRUD function in JSON that can be added to an Open API JSON object.
*/ 
function setGetSublist(name,subname, ref, hasQueryParams, paginationParams, securityParameters){
    
    var splural=subname.plural();
    
    var queryParams = getPaginationParameters(paginationParams);
    
    if (hasQueryParams){
       queryParams = queryParams.concat(getSearchParameters());
    }
    
    //alert(hasQueryParams);
    var getList = {
      "get" : {
        "tags" : [ name ],
        "summary" : "List of "+splural+" within a given "+name+".",
        "description" : "List of "+splural+" within a given "+name+".",
        "operationId" : "get"+splural,
        "security" : securityParameters,
        "parameters" : queryParams,
        "responses" : {
          "200" : {
            "description" : "successful operation",
            "content" : {
              "application/json" : {
                "schema" : {
                  "type" : "array",
                  "items" : {
                    "$ref" : "#/components/schemas/"+subname
                  }
                }
              },
            }
          },
          "401" : {
            "$ref" : "#/components/responses/Unauthorized"
          },
          "404" : {
            "$ref" : "#/components/responses/NotFound"
          },   
          "default" : {
            "$ref" : "#/components/schemas/Error"
          }
        },
      }
    };
    
    return getList;
}
    
    
/*
Provides the GET function for a specific item in a list
Example: files/{id}
Parameters:
- name: the name of the path (singular form of the component schema)
- securityParameters: Array. The list of security parameters to apply to the endpoint
Returns:
- A CRUD function in JSON that can be added to an Open API JSON object.
*/ 
function setGetItem(name, securityParameters){
    var getFunction = {
        "get":{
            "tags": [
                name
         ],   
         "summary":"Obtain a single "+name+" by id",
         "description":"Obtain a single "+name+" by id",
         "operationId": "get"+name,//TODO: fill in
         "security": securityParameters,
         "parameters":[
             {
                "in":"path",
                 "name":"id",
                 "schema":{
                    "type":"string",
                    "format":"uuid"
                 },
                 "required":"true",
                 "description": "Numeric ID of the "+ name + " to get"
            }
         ],
         "responses" : {
          "200" : {
            "description" : "successful operation",
            "content" : {
              "application/json" : {
                "schema" : {
                  "type" : "array",
                  "items" : {
                    "$ref" : "#/components/schemas/"+name
                  }
                }
              },
            }
          },
          "401" : {
            "$ref" : "#/components/responses/Unauthorized"
          },
          "404" : {
            "$ref" : "#/components/responses/NotFound"
          },   
          "default" : {
            "$ref" : "#/components/schemas/Error"
          }
        },
      }
    };
    
    return getFunction;
}


/*
Provides the POST function to create a new component
Example: POST /files
Parameters:
- name: the name of the path (singular form of the component schema)
- securityParameters: Array. The list of security parameters to apply to the endpoint
Returns:
- A CRUD function in JSON that can be added to an Open API JSON object.
*/ 
function setPost(name, securityParameters){
    var postFunction = {
        
            "tags": [ name
         ],   
         "summary":"Create a new "+name,
         "description":"Create a new "+name,
         "operationId": "add"+name,//TODO: fill in
         "security": securityParameters,
         "requestBody": { //TODO: we can detect if a requestBody was specially defined here
            "$ref": "#/components/schemas/"+name
         },  
         "responses" : {
          "200" : {
            "description" : "successful operation",
            "content" : {
              "application/json" : {
                "schema" : {
                  "type" : "array",
                  "items" : {
                    "$ref" : "#/components/schemas/"+name
                  }
                }
              },
            }
          },
          "401" : {
            "$ref" : "#/components/responses/Unauthorized"
          },
          "404" : {
            "$ref" : "#/components/responses/NotFound"
          },   
          "default" : {
            "$ref" : "#/components/schemas/Error"
          }
        },
    };
    
    return postFunction;
}

    
/*
Provides the POST function for a subponent
Example: POST files/{id}/tags
Parameters:
- name: the name of the path (singular form of the component schema)
- subname: the name of the sub-object of the endpoint (like 'tags' in the example)
- ref: the reference path of the component schema to the subendpoint.  A deprecated parameter that's not in use.
- securityParameters: Array. The list of security parameters to apply to the endpoint
Returns:
- A CRUD function in JSON that can be added to an Open API JSON object.
*/ 
function setPostSub(name, subname, ref, securityParameters){
    var postFunction = {
        
         "tags": [ name],   
         "summary":"Create a new "+subname+" within a "+name,
         "description":"Create a new "+subname+" within a "+name,
         "operationId": "add"+subname,//TODO: fill in
         "security": securityParameters,
         "parameters":[
             {
                "in":"path",
                 "name":"id",
                 "schema":{
                    "type":"string",
                    "format":"uuid"
                 },
                 "required":"true",
                 "description": "Numeric ID of the "+ name + " to get"
            }
         ],
         "requestBody": { //TODO: this will be dynamic
            "$ref": "#/components/schemas/"+subname
         },  
         "responses" : {
          "200" : {
            "description" : "successful operation",
            "content" : {
              "application/json" : {
                "schema" : {
                  "type" : "array",
                  "items" : {
                    "$ref" : "#/components/schemas/"+subname
                  }
                }
              },
            }
          },
          "401" : {
            "$ref" : "#/components/responses/Unauthorized"
          },
          "404" : {
            "$ref" : "#/components/responses/NotFound"
          },   
          "default" : {
            "$ref" : "#/components/schemas/Error"
          }
        },
        
    };
    
    return postFunction;
}

    
/*
Provides the PUT function for a component
Example: PUT files/{id}
Parameters:
- name: the name of the path (singular form of the component schema)
- securityParameters: Array. The list of security parameters to apply to the endpoint
Returns:
- A CRUD function in JSON that can be added to an Open API JSON object.
*/ 
function setPut(name, securityParameters){
    var putFunction =  {
         "tags": [
            name
         ],
         "summary": "Update an existing "+name,
         "summary": "Update an existing "+name,
         "operationId": "update"+name,
         "security": securityParameters,
         "parameters":[
             {
                "in":"path",
                 "name":"id",
                 "schema":{
                    "type":"string",
                    "format":"uuid"
                 },
                 "required":"true",
                 "description": "Numeric ID of the "+name+" to update"
            }
          ],
          "requestBody": {
            "$ref": "#/components/requestBodies/"+name
          },
          "responses" : {
           "200" : {
            "description" : "successful operation",
            "content" : {
              "application/json" : {
                "schema" : {
                  "type" : "array",
                  "items" : {
                    "$ref" : "#/components/schemas/"+name
                  }
                }
              },
            }
           },
           "401" : {
            "$ref" : "#/components/responses/Unauthorized"
           },
           "404" : {
            "$ref" : "#/components/responses/NotFound"
           },   
           "default" : {
            "$ref" : "#/components/schemas/Error"
           }
        },
      };
    
    return putFunction;
}

    
/*
Provides the PATCH function for the list of a component under another component 
Example: PATCH files/{id}
Parameters:
- name: the name of the path (singular form of the component schema)
- securityParameters: Array. The list of security parameters to apply to the endpoint
Returns:
- A CRUD function in JSON that can be added to an Open API JSON object.
*/ 
function setPatch(name, securityParameters){
    var patchFunction =  {
         "tags": [
            name
         ],
         "summary": "Update an existing "+name,
         "description": "Update an existing "+name,
         "operationId": "update"+name,
         "security": securityParameters,
         "requestBody": {
            "$ref": "#/components/requestBodies/"+name
          },
         "parameters":[
             {
                "in":"path",
                 "name":"id",
                 "schema":{
                    "type":"string",
                    "format":"uuid"
                 },
                 "required":"true",
                 "description": "Numeric ID of the "+name+" to update"
            }
         ],
         "responses" : {
          "200" : {
            "description" : "successful operation",
            "content" : {
              "application/json" : {
                "schema" : {
                  "type" : "array",
                  "items" : {
                    "$ref" : "#/components/schemas/"+name
                  }
                }
              },
            }
          },
          "401" : {
            "$ref" : "#/components/responses/Unauthorized"
          },
          "404" : {
            "$ref" : "#/components/responses/NotFound"
          },   
          "default" : {
            "$ref" : "#/components/schemas/Error"
          }
        },
      };
    
    return patchFunction;
}
    
   
/*
Provides the DELETE function for the list of a component under another component 
Example: DELETE files/{id}
Parameters:
- name: the name of the path (singular form of the component schema)
- securityParameters: Array. The list of security parameters to apply to the endpoint
Returns:
- A CRUD function in JSON that can be added to an Open API JSON object.
*/ 
function setDelete(name, securityParameters){
    var deleteFunction = {
        "tags" : [ name ],
        "summary" : "Deletes a "+name,
        "operationId" : "delete"+name,
        "security" : securityParameters,
        "parameters" : [ {
          "name" : name+"Id",
          "in" : "path",
          "description" : "ID of the "+name+" to delete",
          "required" : true,
          "schema" : {
            "type" : "integer",
            "format" : "uuid"
          }
        } ],
        "responses" : {
          "200" : {
            "description" : "Successful deletion",
            "content" : {
              "application/json" : {
                "schema" : {
                  "type" : "array",
                  "items" : {
                    "$ref" : "#/components/schemas/"+name
                  }
                }
              },
            }
          },
          "401" : {
            "$ref" : "#/components/responses/Unauthorized"
          },
          "404" : {
            "$ref" : "#/components/responses/NotFound"
          },   
          "default" : {
            "$ref" : "#/components/schemas/Error"
          }
        },
      };
    return deleteFunction;
}

  
/*
This is the main function to create the REST operations and add extra components for an updated OpenAPI schema
Parameters:
- jsonParam: the JSON content of the OpenAPI schema
- hasQueryParams: boolean. Whether the endpoint should have query (search and filter) parameters
- pagination: The type of pagination to offer in list functions (size/offset, next/prev, ...)
- securityTypes: Array. The list of security parameters to apply to the endpoint
- hasErrorSchemas: bool.  Determines whether to add a standard Error schema component and to the responses in all CRUD endpoints. Note that this is not currently in use. We assume to always add the standard error schema.
- updateType: Whether to return PUT or PATCH endpoints.  Can be "PUT", "PATCH", or "BOTH"
Returns:
- A new JSON object of an OpenAPI schema with CRUD functions and extra component schemas as desired.
*/ 
function createRESTFunctions(jsonParam, hasQueryParams, pagination, securityTypes, hasErrorSchemas, updateType){
    
    var myObj = JSON.parse(jsonParam);
    var finalObj = myObj;
    
    
    //We define the security scopes here to be reused
    
    
    /********************************************
    
    Make sure that the OpenAPI schema has the necessary sections defined
    
    *********************************************/
    //alert(finalObj);
    if (!finalObj.components.parameters){
        finalObj.components.parameters = {};
    }
    
    /*******************  
  
    Here's where we traverse the models
  
    ********************/
        
    for(var x of Object.keys(myObj.components.schemas)) {
        
        // Go through each model and create functions from the names
       var securityParameters = getSecurityParameters(finalObj, securityTypes, x);
        
        //Add functions for for the key CRUD operations.
        // GET list, POST, GET specific item, PUT & PATCH item, and Delete item
        finalObj.paths["/"+x.toLowerCase().plural()] = setGetList(x, hasQueryParams, pagination, securityParameters);
        finalObj.paths["/"+x.toLowerCase().plural()].post = setPost(x, securityParameters);
        finalObj.paths["/"+x.toLowerCase().plural()+"/{id}"] = setGetItem(x, securityParameters);
        
        if ((updateType == "PUT")||(updateType=="Both")) {
            finalObj.paths["/"+x.toLowerCase().plural()+"/{id}"].put = setPut(x, securityParameters);
        }
        
        if ((updateType == "PATCH")||(updateType=="Both")) {
            finalObj.paths["/"+x.toLowerCase().plural()+"/{id}"].patch = setPatch(x, securityParameters);
        }
        
        finalObj.paths["/"+x.toLowerCase().plural()+"/{id}"].delete = setDelete(x, securityParameters);

        for (var y of Object.keys(myObj.components.schemas[x].properties)){

            //Sublist handler, for when Components contain subComponents
            if ((myObj.components.schemas[x].properties[y].type =="array")&&(myObj.components.schemas[x].properties[y].items['$ref'])){
            
                finalObj.paths["/"+x.toLowerCase().plural()+"/{id}/"+y.toLowerCase().plural()] = setGetSublist(x, y,myObj.components.schemas[x].properties[y].items['$ref'], hasQueryParams, pagination, securityParameters);
                finalObj.paths["/"+x.toLowerCase().plural()+"/{id}/"+y.toLowerCase().plural()].post = setPostSub(y,myObj.components.schemas[x].properties[y].items['$ref'], securityParameters);
            
            }
        }
       
    }
    
    
      
    /***************************
    
    Adding additional components for tags, search, pagination, errors and security
    
    ***************************/
    
    addTagComponents(finalObj);
    
     if (hasQueryParams){
      addSearchComponents(finalObj);
    }
    
    addPaginationSchemas(finalObj, pagination);
    
    
    if (hasErrorSchemas){
      addErrorSchema(finalObj);
    }
    
    addSecuritySchemes(finalObj, securityTypes);
    
    
    return finalObj;
    
}


