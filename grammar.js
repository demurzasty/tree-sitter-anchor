module.exports = grammar({
  name: "anchor",

  extras: ($) => [/\s/, $.comment],

  word: ($) => $.identifier,

  rules: {
    source_file: ($) => repeat($._definition),

    _definition: ($) =>
      choice(
        $.import_statement,
        $.function_definition,
        $.struct_definition,
        $.interface_definition,
        $.variable_declaration,
        $.const_declaration,
      ),

    comment: ($) => /#.*/,

    import_statement: ($) =>
      seq("from", field("path", $.string), "import", commaSep1($.identifier)),

    function_definition: ($) =>
      seq(
        optional("export"),
        "func",
        field("name", choice($.identifier, $.method_name)),
        "(",
        optional($.parameter_list),
        ")",
        optional(seq(":", $._type)),
        repeat($._statement),
        "end",
      ),

    method_name: ($) =>
      seq(field("type", $.identifier), ".", field("name", $.identifier)),

    struct_definition: ($) =>
      seq(
        optional("export"),
        "struct",
        field("name", $.identifier),
        repeat($.field_declaration),
        "end",
      ),

    interface_definition: ($) =>
      seq(
        optional("export"),
        "interface",
        field("name", $.identifier),
        repeat($.interface_method),
        "end",
      ),

    interface_method: ($) =>
      seq(
        "func",
        field("name", $.identifier),
        "(",
        optional($.parameter_list),
        ")",
        optional(seq(":", $._type)),
      ),

    field_declaration: ($) =>
      seq(field("name", $.identifier), ":", field("type", $._type)),

    parameter_list: ($) => commaSep1($.parameter),

    parameter: ($) =>
      seq(field("name", $.identifier), ":", field("type", $._type)),

    _type: ($) =>
      choice(
        $.reference_type,
        $.pointer_type,
        $.array_type,
        $.slice_type,
        $.type_identifier,
      ),

    type_identifier: ($) => prec(-1, $.identifier),
    reference_type: ($) => seq("&", $._type),
    pointer_type: ($) => seq("*", $._type),
    array_type: ($) => prec(1, seq($.identifier, "[", $.number, "]")),
    slice_type: ($) => prec(1, seq($.identifier, "[", "]")),

    variable_declaration: ($) =>
      seq(
        optional("export"),
        "var",
        field("name", $.identifier),
        optional(seq(":", field("type", $._type))),
        optional(seq("=", field("value", $._expression))),
      ),

    const_declaration: ($) =>
      seq(
        optional("export"),
        "const",
        field("name", $.identifier),
        optional(seq(":", field("type", $._type))),
        "=",
        field("value", $._expression),
      ),

    _statement: ($) =>
      choice(
        $.variable_declaration,
        $.const_declaration,
        $.if_statement,
        $.while_statement,
        $.for_statement,
        $.return_statement,
        $.break_statement,
        $.continue_statement,
        $.assignment,
        $.expression_statement,
      ),

    if_statement: ($) =>
      seq(
        "if",
        field("condition", $._expression),
        repeat($._statement),
        repeat($.elseif_clause),
        optional($.else_clause),
        "end",
      ),

    elseif_clause: ($) =>
      seq("elseif", field("condition", $._expression), repeat($._statement)),

    else_clause: ($) => seq("else", repeat($._statement)),

    while_statement: ($) =>
      seq(
        "while",
        field("condition", $._expression),
        repeat($._statement),
        "end",
      ),

    for_statement: ($) =>
      seq(
        "for",
        field("variable", $.identifier),
        "in",
        field("start", $._expression),
        field("range_type", choice("to", "until")),
        field("end", $._expression),
        optional(seq("step", field("step", $._expression))),
        repeat($._statement),
        "end",
      ),

    return_statement: ($) => prec.right(seq("return", optional($._expression))),
    break_statement: ($) => "break",
    continue_statement: ($) => "continue",

    assignment: ($) =>
      seq(
        field("left", $._expression),
        field("operator", choice("=", "+=", "-=", "*=", "/=")),
        field("right", $._expression),
      ),

    expression_statement: ($) => $._expression,

    _expression: ($) =>
      choice(
        $.identifier,
        $.number,
        $.float,
        $.string,
        $.boolean,
        $.null,
        $.self,
        $.unary_expression,
        $.binary_expression,
        $.call_expression,
        $.index_expression,
        $.slice_expression,
        $.field_expression,
        $.array_literal,
        $.reference_expression,
        $.dereference_expression,
        $.parenthesized_expression,
      ),

    unary_expression: ($) =>
      prec(
        8,
        choice(
          seq("-", $._expression),
          seq("not", $._expression),
          seq("~", $._expression),
        ),
      ),

    binary_expression: ($) =>
      choice(
        prec.left(1, seq($._expression, "or", $._expression)),
        prec.left(2, seq($._expression, "and", $._expression)),
        prec.left(
          3,
          seq(
            $._expression,
            choice("==", "!=", "<", ">", "<=", ">="),
            $._expression,
          ),
        ),
        prec.left(4, seq($._expression, choice("|", "^"), $._expression)),
        prec.left(5, seq($._expression, "&", $._expression)),
        prec.left(6, seq($._expression, choice("+", "-"), $._expression)),
        prec.left(7, seq($._expression, choice("*", "/", "%"), $._expression)),
      ),

    call_expression: ($) =>
      prec(
        9,
        seq(
          field("function", $._expression),
          "(",
          optional(commaSep1($._expression)),
          ")",
        ),
      ),

    index_expression: ($) =>
      prec(
        9,
        seq(
          field("array", $._expression),
          "[",
          field("index", $._expression),
          "]",
        ),
      ),

    slice_expression: ($) =>
      prec(
        9,
        seq(
          field("array", $._expression),
          "[",
          field("start", $._expression),
          ":",
          field("end", $._expression),
          "]",
        ),
      ),

    field_expression: ($) =>
      prec(
        9,
        seq(field("object", $._expression), ".", field("field", $.identifier)),
      ),

    reference_expression: ($) => prec(8, seq("&", $._expression)),
    dereference_expression: ($) => prec(8, seq("*", $._expression)),
    parenthesized_expression: ($) => seq("(", $._expression, ")"),

    array_literal: ($) => seq("[", commaSep1($._expression), "]"),

    identifier: ($) => /[a-zA-Z_][a-zA-Z0-9_]*/,
    number: ($) => /\d+/,
    float: ($) => /\d+\.\d+/,
    string: ($) => /"[^"]*"/,
    boolean: ($) => choice("true", "false"),
    null: ($) => "null",
    self: ($) => "self",
  },
});

function commaSep1(rule) {
  return seq(rule, repeat(seq(",", rule)));
}
