/**
 * This file is NOT inteded to be used directly with other parts of
 * the source code. See --pre-js option for emcc Emscripten compiler.
 *
 * This code allow us to use the Filesystem API outside of the Emscripten module
 * Note: The Emscripten module will be ES6-modularized with -s MODULARIZE=1
 * -s EXPORT_ES6=1 options. See Makefile.
 */
// @ts-nocheck
/* global Module */

/* eslint-disable prettier/prettier, no-undef */
Module['NULL'] = 0;
Module['allocateUTF8OnStack'] = allocateUTF8OnStack;
Module['onRuntimeInitialized'] = function() {
  // Used as a temporary pointer
  Module['tempInt32'] = Module.stackAlloc(4);
  // SQLite3
  Module['sqlite3_open'] = Module.cwrap('sqlite3_open', 'number', ['string', 'number']);
  Module['sqlite3_close_v2'] = Module.cwrap('sqlite3_close_v2', 'number', ['number']);
  Module['sqlite3_exec'] = Module.cwrap('sqlite3_exec', 'number', ['number', 'string', 'number', 'number', 'number']);
  Module['sqlite3_free'] = Module.cwrap('sqlite3_free', null, ['number']);
  Module['sqlite3_changes'] = Module.cwrap('sqlite3_changes', 'number', ['number']);
  Module['sqlite3_prepare_v2'] = Module.cwrap('sqlite3_prepare_v2', 'number', ['number', 'string', 'number', 'number', 'number']);
  Module['sqlite3_prepare_v2_sqlptr'] = Module.cwrap('sqlite3_prepare_v2', 'number', ['number', 'number', 'number', 'number', 'number']);
  Module['sqlite3_bind_text'] = Module.cwrap('sqlite3_bind_text', 'number', ['number', 'number', 'number', 'number', 'number']);
  Module['sqlite3_bind_blob'] = Module.cwrap('sqlite3_bind_blob', 'number', ['number', 'number', 'number', 'number', 'number']);
  Module['sqlite3_bind_double'] = Module.cwrap('sqlite3_bind_double', 'number', ['number', 'number', 'number']);
  Module['sqlite3_bind_int'] = Module.cwrap('sqlite3_bind_int', 'number', ['number', 'number', 'number']);
  Module['sqlite3_bind_parameter_index'] = Module.cwrap('sqlite3_bind_parameter_index', 'number', ['number', 'string']);
  Module['sqlite3_step'] = Module.cwrap('sqlite3_step', 'number', ['number']);
  Module['sqlite3_errmsg'] = Module.cwrap('sqlite3_errmsg', 'string', ['number']);
  Module['sqlite3_data_count'] = Module.cwrap('sqlite3_data_count', 'number', ['number']);
  Module['sqlite3_column_double'] = Module.cwrap('sqlite3_column_double', 'number', ['number', 'number']);
  Module['sqlite3_column_text'] = Module.cwrap('sqlite3_column_text', 'string', ['number', 'number']);
  Module['sqlite3_column_blob'] = Module.cwrap('sqlite3_column_blob', 'number', ['number', 'number']);
  Module['sqlite3_column_bytes'] = Module.cwrap('sqlite3_column_bytes', 'number', ['number', 'number']);
  Module['sqlite3_column_type'] = Module.cwrap('sqlite3_column_type', 'number', ['number', 'number']);
  Module['sqlite3_column_name'] = Module.cwrap('sqlite3_column_name', 'string', ['number', 'number']);
  Module['sqlite3_reset'] = Module.cwrap('sqlite3_reset', 'number', ['number']);
  Module['sqlite3_clear_bindings'] = Module.cwrap('sqlite3_clear_bindings', 'number', ['number']);
  Module['sqlite3_finalize'] = Module.cwrap('sqlite3_finalize', 'number', ['number']);
  Module['sqlite3_create_function_v2'] = Module.cwrap('sqlite3_create_function_v2', 'number', ['number', 'string', 'number', 'number', 'number', 'number', 'number', 'number', 'number']);
  Module['sqlite3_value_type'] = Module.cwrap('sqlite3_value_type', 'number', ['number']);
  Module['sqlite3_value_bytes'] = Module.cwrap('sqlite3_value_bytes', 'number', ['number']);
  Module['sqlite3_value_text'] = Module.cwrap('sqlite3_value_text', 'string', ['number']);
  Module['sqlite3_value_int'] = Module.cwrap('sqlite3_value_int', 'number', ['number']);
  Module['sqlite3_value_blob'] = Module.cwrap('sqlite3_value_blob', 'number', ['number']);
  Module['sqlite3_value_double'] = Module.cwrap('sqlite3_value_double', 'number', ['number']);
  Module['sqlite3_result_double'] = Module.cwrap('sqlite3_result_double', null, ['number', 'number']);
  Module['sqlite3_result_null'] = Module.cwrap('sqlite3_result_null', null, ['number']);
  Module['sqlite3_result_text'] = Module.cwrap('sqlite3_result_text', null, ['number', 'string', 'number', 'number']);
  Module['sqlite3_result_blob'] = Module.cwrap('sqlite3_result_blob', null, ['number', 'number', 'number', 'number']);
  Module['sqlite3_result_int'] = Module.cwrap('sqlite3_result_int', null, ['number', 'number']);
  Module['sqlite3_result_int64'] = Module.cwrap('sqlite3_result_int64', null, ['number', 'number']);
  Module['sqlite3_result_error'] = Module.cwrap('sqlite3_result_error', null, ['number', 'string', 'number']);
};
/* eslint-enable prettier/prettier, no-undef */
