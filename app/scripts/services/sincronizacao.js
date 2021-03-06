/**
 * Serviço de sincronização de projetos canvas.
 * @author Marcio C. de Souza <marcio@kazale.com>
 * @version 0.2.0
 * @since 0.2.0
 */
'use strict';

angular.module( 'kzbmcMobileApp' ).factory( 'sincronizacaoService', [ '$window', '$resource', 
    '$rootScope', 'md5Service', '$location', 
  function( $window, $resource, $rootScope, md5Service, $location ) {

    var sincronizar = {};

    /**
     * Cadastra um novo projeto canvas.
     * @method sincronizacaoService::cadastrar
     * @param {object} projetoCanvasObj { nome, descricao, email, itens }
     * @param {function} sucesso
     * @param {function} erro
     */
    sincronizar.cadastrar = function( projetoCanvasObj, sucesso, erro ) {
      projetoCanvasObj.email = sincronizar.obterUsuario();
      projetoCanvasObj.senha = sincronizar.obterToken();
      var sincronizarServidorResource = $resource( $rootScope.sincronizarServidor[ $rootScope.mode ] );
      sincronizarServidorResource.save( {}, projetoCanvasObj, sucesso, erro );
    };

    /**
     * Atualiza um projeto canvas com os dados do servidor remoto.
     * @method sincronizacaoService::atualizarDoServidorRemoto
     * @param {integer} projetoId
     * @param {function} sucesso
     * @param {function} erro
     */
    sincronizar.atualizarDoServidorRemoto = function( projetoId, sucesso, erro ) {
      var usuario = {};
      usuario.email = sincronizar.obterUsuario();
      usuario.senha = sincronizar.obterToken();
      var sincronizarListarProjeto = $resource( $rootScope.sincronizarListarProjeto[ $rootScope.mode ] );
      sincronizarListarProjeto.save( { id : projetoId }, usuario, sucesso, erro );
    };

    /**
     * Baixa projetos remotos não cadastrados localmente. Remove projetos remotos
     * que foram excluídos localmente.
     * @method sincronizacaoService::baixarProjetosServidor
     * @param {string} idsExistentes ids separados por ','
     * @param {string} idsExcluir ids separados por ','
     * @param {function} sucesso
     * @param {function} erro
     */
    sincronizar.baixarProjetosServidor = function( idsExistentes, idsExcluir, sucesso, erro ) {
      var params = { 'idsExistentes' : idsExistentes, 'idsExcluir' : idsExcluir };
      params.email = sincronizar.obterUsuario();
      params.senha = sincronizar.obterToken();
      var sincronizarCliente = $resource( $rootScope.sincronizarCliente[ $rootScope.mode ] );
      sincronizarCliente.query( params, sucesso, erro );
    };

    /**
     * Retorna o email do usuário utilizado para autenticar no servidor remoto.
     * @method sincronizacaoService::obterUsuario
     * @return {string} usuario
     */
    sincronizar.obterUsuario = function() {
      var usuario = '';
      if( $rootScope.bmc ) {
        usuario = $window.localStorage.usuario || '';
      } else {
        usuario = $window.localStorage.usuarioLean || '';
      }
      if( usuario === '' ) {
        $location.path( '/dados-sincronizar' );
      }
      return usuario;
    };

    /**
     * Retorna o token md5 do usuário utilizado para autenticar no servidor remoto.
     * @method sincronizacaoService::obterToken
     * @return {string} token
     */
    sincronizar.obterToken = function() {
      var token = '';
      if( $rootScope.bmc ) {
        token = $window.localStorage.token || '';
      } else {
        token = $window.localStorage.tokenLean || '';
      }
      return token === '' ? token : md5Service.md5( token );
    };

    return sincronizar;
}]);