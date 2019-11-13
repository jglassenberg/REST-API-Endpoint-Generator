# REST-API-Endpoint-Generator
Welcome! This is a simple project that Automatically generates REST API Endpoints from the component definitions of an OpenAPI schema.

# What it does

When defining an API under the OpenAPI specification, functions have a common pattern. With CRUD operations all around the same components referenced, so that functions have consistency in their format, in their inputs, outputs, etc, one realizes that much of this can be auto-generated.

When the underlying component schemas for an OpenAPI doc are defined, the functions are mostly straightforward to create. The idea here is to easily do that - define your component schemas, then autogenerate your endpoints.

In the process, one can auto-fill much of the rest of the OpenAPI doc: establishing security rules, pagination for lists, and errors.  These are provided as well in this project.

<a href="demo">View Working Demo </a>

# How it Works - Demo App

The page allows you to copy an OpenAPI Schema in JSON format, containing only components (no paths need to be defined).  Simply paste the JSON of the schema in the designated text area, and press "Create Functions."

You may also choose a few options:
- Add search filter parameters to list functions: This adds "q", "sort" and "filter" parameters to your list endpoints
- Choose to have only PATCH endpoints, or PUT endpoints, or both.
- Choose whether to have pagination parameters for list endpoints. These currently can be Limit-Offset or Next-Previous pagination formats.
- Choose whether and which security schemas (Oauth, bearter tokens, basic auth, OpenID, etc) you want to apply to your API

You can choose to receive the output in JSON or YAML format.

You may also run the demo file programmatically by loading it with query parameters:

- json: A URL endoded JSON representation of your full OpenAPI schema. Provide either this, or 'yaml'.
- yaml: A URL endoded JSON representation of your full OpenAPI schema. Provide either this, or 'json'.
- hasQueryParms: Can be 'true' or 'false' (optional: default is 'true'). Whether you want standard query/search parameters in your final schema.
- pagination: Can be 'Limit-Offset' or 'Next-Prev' (optional). Whether you want standard pagination parameters in your final schema, of your choice of pagination format.
- updateType: Can be 'PUT', 'PATCH' or 'BOTH' (optional: default is 'BOTH'). Whether you want only PUT endpoints or PATCH endpoints returned, or whether you want both.
- redurectURL: (optional: default is 'json'). The URL to which you'd like us to redirect and return the updated OpenAPI schema. The content of the schema will be provided as a URL encoded query parameter, 'schema' in the format chosen.

# How it Works - Code

## test.html

This contains two unique functions:

- createAndPrint: the main function, which calls APIFunctionMaker.js to generate a new OpenAPI schema and print it on the test.html page.
- startifParam: this handles the OpenAPI schema creation when the page was called with query parameters.

## APIFunctionMaker.js

The main function here is createRESTFunction, which accepts a JSON representation of an OpenAPI schema and generates a JSON object returning the updated OpenAPI schema, with custom settings.

# Issues and feature enhancements

- The YAML-JSON converter isn't reliable, especially when converting YAML to JSON.
- The demo UI only accepts JSON, not YAML.
- Better handling of defined request bodies in an existing OpenAPI schema
- Better handling of defined response codes in an existing OpenAPI schema
- Better handling of an API schema that already has some paths defined.
- Better organizing of the final OpenAPI structure. Namely that the security schemes are placed at the bottom of the schema
- Addition of helpful comments into the YAML output version
- Improve the experience of auto-generating a template
- More flexible handling of different forms of the input, such as allowing just a component definition without other key aspects of the OpenAPI schema.

# Files:

- APIFunctionMaker.js: The core file that generates the content for the new OpenAPI Schema.
- test.html: a simple page to demonstrate the generator's capability.
- Sample Queries.txt: a few samples for both the test.html UI and the URL request handler
- js-yaml.js: a third-party converter between JSON and YAML, from https://github.com/nodeca/js-yaml

# Dependencies:
- js-yaml.js is a third-party converter between JSON and YAML, from https://github.com/nodeca/js-yaml
