References
------------------
0) sudo apt-get install rabbitmq-server

1) On Unix systems, the cookie will be typically located in /var/lib/rabbitmq/.erlang.cookie or $HOME/.erlang.cookie.
ex: RABBIT-CLUSTER-ERLANG

2) To start the server as daemon by default when the RabbitMQ server package is installed.
> sudo su
> invoke-rc.d rabbitmq-server stop
> invoke-rc.d rabbitmq-server stop

3) config file(s) : /etc/rabbitmq/rabbitmq.config
All cluster system should have same cookie

Set up rabbit mqadmin

https://raw.githubusercontent.com/rabbitmq/rabbitmq-management/rabbitmq_v3_5_3/bin/rabbitmqadmin

5) guest can access only from localhost https://www.rabbitmq.com/access-control.html

================
LINKS
================
https://www.rabbitmq.com/clustering.html

===========================
IMPORTANT LOCATION OF RABBITMQ
===========================

1) /var/lib/rabbitmq/        ---> CONTAINS  rabbitmq.config , rabbitmq-env.conf
2) cd /etc/rabbitmq/         ---> CONTAINS  rabbitmq.config , rabbitmq-env.conf

================
rabbitmq.config
================
[
  {mnesia, [{dump_log_write_threshold, 1000}]},
  {rabbit, [{tcp_listeners, [5672]},
            {loopback_users, []},
            {cluster_nodes, {['rabbit@ip-172-31-22-115',
                              'rabbit@ip-172-31-5-74',
                              'rabbit@ip-172-31-8-176'], disc}}
           ]}
].


==========================
My Commands References
==========================
rabbitmq-server -detached
rabbitmqctl stop
rabbitmqctl cluster_status

While updating any config or joining or removing from cluster
-------------------------------------
 rabbitmqctl stop_app
// Do required thing then
 rabbitmqctl start_app

rabbit1> rabbitmqctl cluster_status
rabbit1> rabbitmqctl join_cluster rabbit@rabbit2
rabbit1> rabbitmqctl reset
rabbit1> rabbitmqctl forget_cluster_node rabbit@rabbit1