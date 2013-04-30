# swigql

[swig](https://github.com/paularmstrong/swig) templating for SQL

## Installation

	npm install swigql

## Examples

### Template code

```
SELECT
  id
  , first_name
  , last_name
FROM person
WHERE
  first_name = {% bind fn %}
  AND last_name IN {% in last_names %}
```

### node.js code

```javascript
var swigql = require('swigql');

var tmpl = swigql.compileFile('/path/to/template.sql');
var results = tmpl.render({
	fn: 'James',
	last_names: ['Franklin', 'Cooper', 'Smitty', 'Black']
});

console.log(results);
```

### Output

```
[ 'SELECT\n  id\n  , first_name\n  , last_name\nFROM person\nWHERE\n  first_name = $1\n  AND last_name IN ($2, $3, $4, $5)',
  [ 'James', 'Franklin', 'Cooper', 'Smitty', 'Black' ] ]
```

## Notes

swigql is simply a wrapper around swig with two differences:

1. swigql adds a custom tag to swig named `bind`. This tag will substitute the
   variable with the appropriate positional parameter (ex. $1).

2. Instead of returning just the output of the template, it also returns the
   bind parameters in an array suitable for passing to a database driver such
   as [node-postgres](https://github.com/brianc/node-postgres/wiki/pg).

3. swigql also adds a tag named `in` which iterates over an array and creates
   a string suitable for use with an IN statement.

Bringing some powerful features of swig templating, such as [template
inheritance](http://paularmstrong.github.com/swig/docs/#inheritance) opens the
door for some interesting possibilities for writing reusable sql queries.  For
example, you could have a base query that you can extend to add more fields to
the SELECT, or more conditions to the WHERE clause.

### Example base query template

```
SELECT
	{% block select %}
	id
	{% endblock %}
FROM tbl
	{% block joins %}
	{% endblock %}
WHERE 1=1
	{% block where %}
	{% endblock %}
```

### Example sub query template

```
{% extends 'base.sql' %}

{% block select %}
	{% parent %}
	, my_fk
{% endblock %}

{% block joins %}
{% parent %}
INNER JOIN other_tbl USING (my_fk)
{% endblock %}

{% block where %}
	AND my_fk = {% bind myVal %}
{% endblock %}
```

## See also

[swig](https://github.com/paularmstrong/swig)

## License

Copyright (c) 2013 Civitas Learning Inc

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
