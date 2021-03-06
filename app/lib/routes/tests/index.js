// External dependencies
import find from 'lodash/find';

// Internal dependencies
import {
	getRouteWithLanguageSlug,
	getLocaleSlug,
	getLocalizedRoutes,
	isExternalUrl,
	stripLocaleSlug,
} from '..';

describe( 'lib/routes', () => {
	describe( 'getRouteWithLanguageSlug', () => {
		it( 'should prefix the path of the given route with a locale slug', () => {
			expect( getRouteWithLanguageSlug( { langSlug: 'ja' }, { path: 'learn-more' } ) ).toEqual( {
				path: 'ja/learn-more'
			} );
		} );

		it( 'should return the locale slug if the given path is a slash', () => {
			expect( getRouteWithLanguageSlug( { langSlug: 'ja' }, { path: '/' } ) ).toEqual( {
				path: 'ja'
			} );
		} );

		it( 'should ignore path if it is undefined', () => {
			expect( getRouteWithLanguageSlug( { langSlug: 'ja' }, {} ) ).toEqual( {
				path: 'ja'
			} );
		} );
	} );

	describe( 'getLocaleSlug', () => {
		it( 'should get the locale slug, if present', () => {
			expect( getLocaleSlug( '/fr/foobar' ) ).toBe( 'fr' );
		} );

		it( 'should return undefined if no locale slug is present', () => {
			expect( getLocaleSlug( '/foobar' ) ).toBe( undefined );
		} );

		it( 'should return the locale slug for a URL with only the locale', () => {
			expect( getLocaleSlug( '/fr' ) ).toBe( 'fr' );
		} );
	} );

	describe( 'stripLocaleSlug', () => {
		it( 'should not modify strings that do not begin with a locale slug', () => {
			expect( stripLocaleSlug( '/foobar' ) ).toBe( '/foobar' );
		} );

		it( 'should strip out the locale slug', () => {
			expect( stripLocaleSlug( '/fr/foobar' ) ).toBe( '/foobar' );
		} );

		it( 'should only strip out the first locale slug', () => {
			expect( stripLocaleSlug( '/fr/fr/foobar' ) ).toBe( '/fr/foobar' );
		} );

		it( 'should return root for a URL with only the locale', () => {
			expect( stripLocaleSlug( '/fr/' ) ).toBe( '/' );
			expect( stripLocaleSlug( '/fr' ) ).toBe( '/' );
		} );
	} );

	describe( 'getLocalizedRoutes', () => {
		it( 'should prefix each top-level route with a locale slug', () => {
			const localizedRoutes = getLocalizedRoutes( [
				{
					path: '/'
				},
				{
					path: 'foo'
				}
			] );

			expect( find( localizedRoutes, { path: 'fr/foo' } ) ).toEqual( {
				path: 'fr/foo'
			} );

			expect( find( localizedRoutes, { path: 'fr' } ) ).toEqual( {
				path: 'fr'
			} );
		} );

		it( 'should not prefix nested routes', () => {
			const localizedRoutes = getLocalizedRoutes( [
				{
					path: '/'
				},
				{
					path: 'foo',
					childRoutes: [ {
						path: 'bar'
					} ]
				}
			] );

			expect( find( localizedRoutes, { path: 'fr/foo' } ).childRoutes ).toEqual( [ {
				path: 'bar'
			} ] );
		} );
	} );

	describe( 'isExternalUrl', () => {
		it( 'should return true for absolute URLs', () => {
			expect( isExternalUrl( 'https://example.com' ) ).toBeTruthy();
			expect( isExternalUrl( 'http://example.com' ) ).toBeTruthy();
			expect( isExternalUrl( '//example.com' ) ).toBeTruthy();
			expect( isExternalUrl( 'ftp://example.com' ) ).toBeTruthy();
		} );

		it( 'should return false for relative URLs', () => {
			expect( isExternalUrl( 'example.com' ) ).toBeFalsy();
			expect( isExternalUrl( '/example' ) ).toBeFalsy();
		} );

		it( 'should return true for mailto: URLs', () => {
			expect( isExternalUrl( 'mailto:foo@bar.com' ) ).toBeTruthy();
		} );
	} );
} );
