; Keywords
[
  "func"
  "end"
  "if"
  "elseif"
  "else"
  "while"
  "for"
  "in"
  "to"
  "until"
  "step"
  "return"
  "var"
  "const"
  "struct"
  "interface"
  "export"
  "from"
  "import"
] @keyword

(break_statement) @keyword
(continue_statement) @keyword

; Logical operators as keywords
[
  "and"
  "or"
  "not"
] @keyword.operator

; Literals
(boolean) @constant.builtin
(null) @constant.builtin
(number) @number
(float) @number
(string) @string

; Comments
(comment) @comment

; Types
(type_identifier) @type
(struct_definition name: (identifier) @type)
(interface_definition name: (identifier) @type)
(array_type (identifier) @type)
(slice_type (identifier) @type)

; Functions
(function_definition name: (identifier) @function)
(function_definition name: (method_name (identifier) @type "." (identifier) @function.method))
(call_expression function: (identifier) @function.call)
(call_expression function: (field_expression field: (identifier) @function.method.call))
(interface_method name: (identifier) @function)

; Variables and parameters
(parameter name: (identifier) @variable.parameter)
(field_declaration name: (identifier) @property)
(variable_declaration name: (identifier) @variable)
(const_declaration name: (identifier) @constant)
(for_statement variable: (identifier) @variable)

; Field access
(field_expression field: (identifier) @property)

; Operators
[
  "="
  "+="
  "-="
  "*="
  "/="
  "+"
  "-"
  "*"
  "/"
  "%"
  "=="
  "!="
  "<"
  ">"
  "<="
  ">="
  "|"
  "&"
  "^"
  "~"
] @operator

; Punctuation
[
  "("
  ")"
  "["
  "]"
] @punctuation.bracket

[
  ","
  ":"
  "."
] @punctuation.delimiter

; Special
(self) @variable.builtin
