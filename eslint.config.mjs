import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';

export default tseslint.config(
    {
        ignores: ['build/**', 'webpack.config.js', 'rspack.config.js', 'process-html.js'],
    },
    ...tseslint.configs.recommended,
    {
        files: ['src/**/*.{ts,tsx}'],
        plugins: {
            react: reactPlugin,
            'react-hooks': reactHooksPlugin,
        },
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
                ecmaFeatures: {
                    jsx: true,
                },
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
        rules: {
            // TypeScript
            '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
            '@typescript-eslint/ban-ts-comment': 'off',
            '@typescript-eslint/consistent-type-assertions': 'error',
            '@typescript-eslint/consistent-type-definitions': 'error',
            '@typescript-eslint/consistent-type-imports': 'error',
            '@typescript-eslint/dot-notation': 'error',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@typescript-eslint/explicit-member-accessibility': ['off', { accessibility: 'explicit' }],
            '@typescript-eslint/no-empty-function': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-namespace': 'off',
            '@typescript-eslint/no-shadow': 'error',
            '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'error',
            '@typescript-eslint/no-unnecessary-condition': 'error',
            '@typescript-eslint/no-unnecessary-type-arguments': 'error',
            '@typescript-eslint/no-unnecessary-type-assertion': 'error',
            '@typescript-eslint/no-unused-expressions': 'error',
            '@typescript-eslint/no-unused-vars': ['error', { varsIgnorePattern: '^_', argsIgnorePattern: '^_' }],
            '@typescript-eslint/no-require-imports': 'off',
            '@typescript-eslint/non-nullable-type-assertion-style': 'error',
            '@typescript-eslint/prefer-enum-initializers': 'error',
            '@typescript-eslint/prefer-for-of': 'error',
            '@typescript-eslint/prefer-function-type': 'error',
            '@typescript-eslint/prefer-namespace-keyword': 'error',
            '@typescript-eslint/prefer-readonly': 'error',
            '@typescript-eslint/restrict-plus-operands': 'error',
            '@typescript-eslint/triple-slash-reference': ['error', { path: 'always', types: 'prefer-import', lib: 'always' }],
            '@typescript-eslint/no-non-null-assertion': 'off',

            // React
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'error',
            'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never', propElementValues: 'always' }],
            'react/self-closing-comp': ['error', { component: true, html: true }],
            'react/react-in-jsx-scope': 'off',
            'react/prop-types': 'off',

            // General
            'arrow-body-style': ['error', 'as-needed'],
            curly: 'error',
            'eol-last': 'error',
            eqeqeq: ['error', 'smart'],
            'guard-for-in': 'error',
            'new-parens': 'error',
            'no-caller': 'error',
            'no-duplicate-imports': 'error',
            'no-eval': 'error',
            'no-extra-bind': 'error',
            'no-multiple-empty-lines': ['error', { max: 2 }],
            'no-new-func': 'error',
            'no-new-wrappers': 'error',
            'no-return-await': 'error',
            'no-sequences': 'error',
            'no-template-curly-in-string': 'error',
            'no-throw-literal': 'error',
            'no-undef-init': 'error',
            'object-shorthand': 'error',
            'one-var': ['error', 'never'],
            'prefer-object-spread': 'error',
            radix: 'error',
        },
    },
);
