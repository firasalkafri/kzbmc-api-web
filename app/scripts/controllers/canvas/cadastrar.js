/**
 * Controller de cadastro de um item de canvas.
 * @author Marcio C. de Souza <marcio@kazale.com>
 * @version 0.2.0
 * @since 0.2.0
 */
'use strict';

angular.module( 'kzbmcMobileApp' ).controller( 'CanvasCadastrarCtrl', [ '$scope', '$window', '$routeParams', '$location', 
		'canvasService', 
	function( $scope, $window, $routeParams, $location, canvasService  ) {
	  
		/**
		 * Cadastra um novo item no canvas.
		 * @method CanvasCadastrarCtrl::cadastrar
		 * @param {object} item
		 */
		$scope.cadastrar = function( item ) {
			if( $scope.form.$valid ) {
				var itemCanvasObj = { 
					'id_projeto_canvas' : $scope.projetoId, 
					'tipo' : $scope.tipo, 
					'titulo' : item.titulo,
					'descricao' : item.descricao, 
					'cor' : item.cor,
					'email' : $window.sessionStorage.email
				};
				canvasService.cadastrar( $scope.projetoId, itemCanvasObj, 
					function() {
			    		$location.path( '/canvas/' + $scope.projetoId );
			    	},
			    	function() {
			     		$scope.erro = true;
			    	}
			    );
			}
		};

		/**
		 * Carrega um projeto canvas para cadastro de um novo item de canvas.
		 * @method CanvasCadastrarCtrl::carregarProjeto
		 */
		$scope.carregarProjeto = function() {
			$scope.projetoId = $routeParams.projetoId;
			$scope.tipo = $routeParams.tipo;

			canvasService.carregarProjeto( $scope.projetoId, 
				function( response ) {
					$scope.projeto = response.projeto || [];
					$scope.validarParametros();
				},
				function() {
					$location.path( '/' );
				}
			);
		};

		/**
		  * Retorna o nome completo de um tipo de item canvas dado sua abreviação.
		  * @method CanvasCadastrarCtrl::obterNomeItemPorTipo
		  */
		$scope.obterNomeItemPorTipo = function() {
			return canvasService.obterNomeItemPorTipo( $scope.tipo );
		};

		/**
		 * Valida os parâmetros de entrada de uma requisição de cadastro de um novo item.
		 * @method CanvasCadastrarCtrl::validarParametros
		 */
		$scope.validarParametros = function() {
			var tipos = [ 'pc', 'ac', 'rc', 'pv', 'rcl', 'ca', 'sc', 'ec', 'fr' ];
			if( $scope.projeto === false || tipos.indexOf( $scope.tipo ) === -1 ) {
				$location.path( '/' );
			}
		};

		$scope.carregarProjeto();
  	}
]);