/* 
 * Con este script SQL creamos la estructura de tablas para la base de datos
 */
drop table BidAsk;

create table BidAsk(
    milisegundos char(13),
    bidPrice double,
    askPrice double,
    exchange varchar(15),
    market char(10),
    primary key(exchange, market, milisegundos)
);

