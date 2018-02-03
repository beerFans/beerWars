import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {Apollo, ApolloModule} from 'apollo-angular';
import {HttpLink, HttpLinkModule} from 'apollo-angular-link-http';
import {InMemoryCache} from 'apollo-cache-inmemory';

//Reak time db imports
import {getOperationAST} from 'graphql';
import {WebSocketLink} from 'apollo-link-ws';
import {ApolloLink} from 'apollo-link';


@NgModule({
  exports: [
    HttpClientModule,
    ApolloModule,
    HttpLinkModule
  ]
})
export class GraphQLModule {
  constructor(apollo: Apollo, httpLink: HttpLink) {

    const uri = 'https://api.graph.cool/simple/v1/cjaoy20xd3avn01498ehx2atp';
    const http = httpLink.create({ uri });


    const ws = new WebSocketLink({
      uri: `wss://subscriptions.graph.cool/v1/cjaoy20xd3avn01498ehx2atp`,
      options: {
        reconnect: true,
        timeout: 30000
      }
    });

    apollo.create({
      link: ApolloLink.split(
        operation => {
          const operationAST = getOperationAST(operation.query, operation.operationName);
          return !!operationAST && operationAST.operation === 'subscription';
        },
        ws,
        http,
      ),
      cache: new InMemoryCache()
    });
  }
}
