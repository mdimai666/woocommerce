/**
 * External dependencies
 */
const { join } = require( 'path' );

module.exports = {
	defaultValues: {
		namespace: 'extension',
		slug: 'example-product-editor-block',
		version: '0.1.0',
		category: 'widgets',
		title: 'Example Product Editor Block',
		description: 'A block to demonstrate extending the Product Editor',
		dashicon: 'flag',
		license: 'GPL-3.0+',
		attributes: {
			message: {
				type: 'string',
				source: 'text',
				selector: 'div',
			},
		},
		supports: {
			html: false,
			inserter: false,
		},
		npmDevDependencies: [
			'@types/wordpress__block-editor@^7.0.0',
			'@types/wordpress__blocks@^11.0.9',
			'@woocommerce/dependency-extraction-webpack-plugin',
			'@woocommerce/eslint-plugin',
			'@wordpress/prettier-config',
			'@wordpress/stylelint-config',
			'eslint-import-resolver-typescript',
		],
		customScripts: {
			postinstall: 'composer install',
		},
		wpScripts: true,
		wpEnv: true,
		editorScript: 'file:./index.js',
		editorStyle: 'file:./index.css',
		style: 'file:./index.css',
		customBlockJSON: {
			script: 'file:./index.js',
		},
	},
	pluginTemplatesPath: join( __dirname, 'plugin-templates' ),
	blockTemplatesPath: join( __dirname, 'block-templates' ),
};
