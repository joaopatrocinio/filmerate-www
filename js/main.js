var app = angular.module("filmerate", ["ngRoute"]);
app.config(function ($routeProvider, $locationProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "home.html",
            controller: "homeCtrl"
        })
        .when("/admin", {
            templateUrl: "admin.html",
            controller: "adminCtrl"
        })
        .when("/filmes", {
            templateUrl: "filmes.html",
            controller: "filmesCtrl"
        })
        .when("/profile", {
            templateUrl: "profile.html",
            controller: "profileCtrl"
        })
        .when("/filme/:id", {
            templateUrl: "filme.html",
            controller: "filmeCtrl"
        })
        .when("/ator", {
            templateUrl: "ator.html",
            controller: "atorCtrl"
        })
        .when("/realizador", {
            templateUrl: "realizador.html",
            controller: "realizadorCtrl"
        })
        .when("/watchlist", {
            templateUrl: "watchlist.html",
            controller: "watchlistCtrl"
        })
        .when("/filme_edit", {
            templateUrl: "filme_edit.html",
            controller: "filmeEditCtrl"
        })
        .when("/privacy", {
            templateUrl: "privacy.html",
            controller: "privacyCtrl"
        })
        .when("/user/:id", {
            templateUrl: "user.html",
            controller: "userCtrl"
        })
        .otherwise({
            templateUrl: "404.html"
        });

    $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('!');
});

app.directive('loading', function () {
    return {
        restrict: 'E',
        replace:true,
        template: '<div id="modalLoading" class="modal"><div class="modal-content" id="modal-loader"><div class="loader"></div><span style="margin-top:1em">Loading...</span></div></div>',
        link: function (scope, element, attr) {
            scope.$watch('loading', function (val) {
                if (val) {
					$(element).show();
					timeout = setTimeout(function () {
						location.reload();
					}, 4000)
				}
                else {
					clearTimeout(timeout);
					$(element).hide();
				}
            });
        }
    }
});

app.controller('headerCtrl', function ($scope, $http) {
    $scope.loading = true;
    $scope.fullname = "Login";

	//$http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

    if (Cookies.get('x-access-token')) {
        $http.defaults.headers.common = {
            'x-access-token': Cookies.get('x-access-token')
        };

        if (!Cookies.get('user_fullname') || !Cookies.get('admin')) {
            $http
                .get(url_api + "auth/me")
                .then(function (data) {
                    var user = data.data.response;
                    $scope.fullname = user.user_firstname + ' ' + user.user_lastname;
                    Cookies.set('user_fullname', $scope.fullname);
                    Cookies.set('user_id', user.user_id);
                    document.getElementById("nav-user").href = "./profile";
                    if (user.user_user_type_id == 1) {
                        Cookies.set('admin', 'true');
                        document.getElementById("nav-item-admin").style.display = "block";
                    } else {
                        Cookies.set('admin', 'false');
                    }
                    $scope.loading = false;
                });
        } else {
            $scope.fullname = Cookies.get('user_fullname');
            if (Cookies.get('admin') != "false") document.getElementById("nav-item-admin").style.display = "block";
            document.getElementById("nav-user").href = "./profile";
            $scope.loading = false;
        }
    }
});

app.controller('filmesCtrl', function ($scope, $http) {
    $scope.loading = true;
    document.title = "Movies - FilmeRate";

	var size = parseInt(urlParam('size')) || 12;
	var page = parseInt(urlParam('page')) || 1;
    var query = urlParam('query') || 0;
    var category = urlParam('cat') || 0;
    var year = urlParam('year') || 0;

	$scope.size = size;
    $scope.nextPage = page + 1;
    $scope.category = category;
    $scope.query = query;
    $scope.year = year;

    $scope.sizes = [12, 24, 36, 60];

    if (query == 0 || query == '0') {
        if (category != 0 && category != '0') {
            $http
                .get(url_api + "genero/" + category + "/size/" + size + "/page/" + page)
                .then(function (data) {
                    $scope.filmes = data.data.response;
                    $scope.filmeCount = data.data.response.length;
                    $scope.loading = false;
                }, function (data) {
                    // not found
                    $scope.error_message = "Movies not found."
                    $scope.loading = false;
                });
        } else if (year != 0 && year != '0') {
            $http
                .get(url_api + "ano/" + year + "/size/" + size + "/page/" + page)
                .then(function (data) {
                    $scope.filmes = data.data.response;
                    $scope.filmeCount = data.data.response.length;
                    $scope.loading = false;
                }, function (data) {
                    // not found
                    $scope.error_message = "Movies not found."
                    $scope.loading = false;
                });
        } else {
            $http
                .get(url_api + "filme/size/" + size + "/page/" + page)
                .then(function (data) {
                    $scope.filmes = data.data.response;
                    $scope.filmeCount = data.data.response.length;
                    $scope.loading = false;
                }, function (data) {
                    // not found
                    $scope.error_message = "Movies not found."
                    $scope.loading = false;
                });
        }
    } else {
        $http
        .get(url_api + "filme/search/" + query + "/size/" + size + "/page/" + page)
        .then(function (data) {
            // success
            $scope.filmes = data.data.response;
            $scope.filmeCount = data.data.response.length;
            $scope.loading = false;
        }, function (data) {
            // not found
            $scope.error_message = "Movie not found."
            $scope.loading = false;
        });
    }

    $http
        .get(url_api + "genero/")
        .then(function (data) {
            $scope.generos = data.data.response;
            $scope.loading = false;
        });

    $http
        .get(url_api + "ano/")
        .then(function (data) {
            $scope.anos = data.data.response;
            $scope.loading = false;
        });

    $scope.changeSize = function () {
        window.location.href = "./filmes?size=" + $scope.showSize + "&page=1&year=" + $scope.year + "&cat=" + $scope.category +"&query=" + $scope.query;
    };
    $scope.changeGenre = function () {
        window.location.href = "./filmes?size=" + $scope.size + "&page=1&year=0&cat=" + $scope.genero.genero_id + "&query=0";
    };
    $scope.changeYear = function () {
        window.location.href = "./filmes?size=" + $scope.size + "&page=1&year=" + $scope.ano.filme_ano + "&cat=0&query=0";
    };
});

app.controller('homeCtrl', function ($scope, $http) {
    document.title = "Home - FilmeRate";
    $scope.loading = true;

    /*document.addEventListener('click', function (event) {
        if (event.target.matches('.dropdown-item')) return;
        if (event.target.matches('.dropdown')) return;
        if (event.target.matches('.dropdown-menu')) return;
        if (event.target.matches('.dropdown-click')) return;
        document.querySelector('.dropdown-menu').classList.remove('show');
    }, false);*/

    if (Cookies.get('x-access-token')) {
        $scope.logged_in = true;
        var token = parseJwt(Cookies.get('x-access-token'));
        $scope.admin = token.user_type == 1 ? true : false;
        $scope.user_id = token.id;
    }
	else $scope.logged_in = false;

    var sorting = urlParam('sorting') || 'top';
    if (sorting != "trending" && sorting != "top" && sorting != "new") {
        window.location = "./";
    }

	$(".filmerate-content-item-selected").removeClass('filmerate-content-item-selected');
	if (sorting == "new") var string_element = "#filmerate-sorting-" + sorting;
	if (sorting == "top") var string_element = "#filmerate-sorting-" + sorting;
	if (sorting == "trending") var string_element = "#filmerate-sorting-" + sorting;
	$(string_element).addClass('filmerate-content-item-selected');

    $http
        .get(url_api + "filme/trending")
        .then(function (data) {
            $scope.trending = data.data.response;
        })

	$http
		.get(url_api + "filme/count")
		.then(function (data) {
            $scope.count = data.data.response.filmes_count;
            $http
                .get(url_api + "genero/")
                .then(function (data) {
                    $scope.generos = data.data.response;
                    if ($scope.logged_in == false) {
                        $http
                            .get(url_api + "review/" + sorting)
                            .then(function (data) {
                                $scope.review = data.data.response;
                                $scope.review_data = $scope.review.map(function (obj) {
                                    return {
                                        data: moment(obj.filme_classificacao_data).calendar()
                                    }
                                });
                                $scope.review_score = $scope.review.map(function (obj) {
                                    return {
                                        likes: obj.likes,
                                        dislikes: obj.dislikes
                                    }
                                });
                                $scope.loading = false;
                                setTimeout(function () {
                                    $scope.loadStars();
                                }, 100);
                            }, function () {
                                $scope.loading = false;
                                $scope.error_message = "No reviews found in this sorting method.";
                            });
                    } else {
                        $http
                            .get(url_api + "user/reviews/" + sorting)
                            .then(function (data) {
                                $scope.review = data.data.response;
                                $scope.review_data = $scope.review.map(function (obj) {
                                    return {
                                        data: moment(obj.filme_classificacao_data).calendar()
                                    }
                                });
                                $scope.review_score = $scope.review.map(function (obj) {
                                    return {
                                        likes: obj.likes,
                                        dislikes: obj.dislikes,
                                        liked: obj.liked,
                                        disliked: obj.disliked,
                                    }
                                });
                                $scope.loading = false;
                                setTimeout(function () {
                                    $scope.loadStars();
                                }, 100);
                            }, function () {
                                $scope.loading = false;
                                $scope.error_message = "No reviews found for this sorting method.";
                            });
                    }
                });
		});

    $scope.likeReview = function (id, index) {
        $http({
            method: 'POST',
            url: url_api + "user/review/like",
            data: {
                filme_classificacao_id: id
            }
        }).then(function () {
            if ($scope.review_score[index].disliked == 1) {
                $scope.review_score[index].disliked = 0;
                $scope.review_score[index].dislikes -= 1;
            }
            $scope.review_score[index].liked = 1;
            $scope.review_score[index].likes += 1;
        }, function () {
            alert("error");
        });
    };

    $scope.dislikeReview = function (id, index) {
        $http({
            method: 'POST',
            url: url_api + "user/review/dislike",
            data: {
                filme_classificacao_id: id
            }
        }).then(function () {
            if ($scope.review_score[index].liked == 1) {
                $scope.review_score[index].liked = 0;
                $scope.review_score[index].likes -= 1;
            }
            $scope.review_score[index].disliked = 1;
            $scope.review_score[index].dislikes += 1;
        }, function () {
            alert("error");
        });
    };

    $scope.loadStars = function () {
        for (i = 0; i < $scope.review.length; i++) {
            var string_roteiro = "#roteiro-" + $scope.review[i].filme_classificacao_id;
            $(string_roteiro).starrr({
                max: 10,
                rating: $scope.review[i].filme_classificacao_roteiro,
                readOnly: true
            });
            var string_atores = "#atores-" + $scope.review[i].filme_classificacao_id;
            $(string_atores).starrr({
                max: 10,
                rating: $scope.review[i].filme_classificacao_atores,
                readOnly: true
            });
            var string_cenario = "#cenario-" + $scope.review[i].filme_classificacao_id;
            $(string_cenario).starrr({
                max: 10,
                rating: $scope.review[i].filme_classificacao_cenario,
                readOnly: true
            });
            var string_execucao = "#execucao-" + $scope.review[i].filme_classificacao_id;
            $(string_execucao).starrr({
                max: 10,
                rating: $scope.review[i].filme_classificacao_execucao,
                readOnly: true
            });
        }
    };

    $scope.openOptions = function (id) {
        var string_element = "#options-" + id;
        if ($(string_element).hasClass('show')) {
            $(string_element).removeClass('show');
        } else {
            $(string_element).addClass('show');
        }
    };

	$scope.changeSorting = function (sorting) {
		window.location = "./?sorting=" + sorting;
	};

    $scope.changeReportId = function (id) {
        $scope.report_id = id;
    };

    $scope.enviarReport = function (id) {
        $http({
            method: 'POST',
            url: url_api + "review/report",
            data: {
                filme_classificacao_id: id,
                filme_report_motivo: $("#filme_report_motivo").val()
            }
        }).then(function (data) {
            window.location = "./";
        });
    };

    $scope.changeDeleteId = function (id) {
        $scope.review_id = id;
    };

    $scope.apagarReview = function (id) {
        $http({
            method: 'POST',
            url: url_api + "user/review/delete",
            data: {
                filme_classificacao_id: id
            }
        }).then(function (data) {
            window.location = "./";
        });
    };
});

app.controller('adminCtrl', function ($scope, $http) {
    document.title = "Admin - FilmeRate";
    $scope.loading = true;
    $http
        .get(url_api + "admin/stats")
        .then(function (data) {
            $scope.stats = data.data.response;
            $scope.loading = false;
        });

    $http
        .get(url_api + 'admin/reports/list/all')
        .then(function (data) {
            $scope.reports = data.data.response;
        });

    $http
        .get(url_api + "admin/users")
        .then(function (data) {
            $scope.user = data.data.response;
            $scope.loading = false;
        });

    $scope.scrape = function() {
        $scope.scrape_message = "";
        $scope.loading = true;
        $http
            .post(url_api + 'admin/scrape/' + $scope.imdb_id)
            .then(function (data) {
                if (data.status == 200) {
                    $scope.scrape_message = "Filme inserido com sucesso.";
                    $scope.loading = false;
                }
            }, function (data) {
				$scope.scrape_message = "Erro ao inserir o filme.";
                $scope.loading = false;
			});
    };

    $scope.changeDeleteModalId = function (id) {
        $scope.delete_user_id = id;
    };

    $scope.changeIgnoreModalData = function (id) {
        $scope.ignore_report_id = id;
    };

    $scope.changeDeleteReportModalId = function (id) {
        $scope.delete_report_id = id;
    }

    $scope.ignoreReport = function (id) {
        $http({
            method: 'POST',
            url: url_api + 'admin/reports/ignore',
            data: {
                filme_report_id: id
            }
        }).then(function (id) {
            $scope.loading = true;
            $http
                .get(url_api + 'admin/reports/list/all')
                .then(function (data) {
                    $scope.reports = data.data.response;
                    $scope.loading = false;
                });
        });
    };

    $scope.deleteReport = function (id) {
        $http({
            method: 'POST',
            url: url_api + 'admin/reports/accept',
            data: {
                filme_classificacao_id: id
            }
        }).then(function (id) {
            $scope.loading = true;
            $http
                .get(url_api + 'admin/reports/list/all')
                .then(function (data) {
                    $scope.reports = data.data.response;
                    $scope.loading = false;
                });
        });
    };

    $scope.deleteUser = function (id) {
        $scope.loading = true;
        $http({
            method: 'POST',
            data: {
                user_id: id
            },
            url: url_api + 'admin/user/delete'
        }).then(function (data) {
            // success
            $http
                .get(url_api + "admin/users")
                .then(function (data) {
                    $scope.user = data.data.response;
                    $scope.loading = false;
                });
        });
    };

    $scope.updateUser = function (id) {
        $scope.loading = true;
        $http({
            method: 'POST',
            url: url_api + 'admin/user/update',
            data: {
                user_id: id,
                user_firstname: $("#user_firstname").val(),
                user_lastname: $("#user_lastname").val(),
                user_data_nascimento: moment($("#user_data_nascimento").val()).format('YYYY-MM-DD'),
                user_bio: $("#user_bio").val(),
                user_sexo_id: $('input[name=user_sexo_id]:checked').val(),
                user_pais_id: $("#user_pais_id").val(),
                user_user_type_id: $("#user_user_type_id").val()
            }
        }).then(function (data) {
            $http
                .get(url_api + "admin/users")
                .then(function (data) {
                    $scope.user = data.data.response;
                    $scope.loading = false;
                });
        })
    }

    $scope.changeModalData = function (id) {
        $scope.edit_user_id = id;
        $http
            .get(url_api + 'user/pais/list')
            .then(function (data) {
                $scope.pais = data.data.response;
                $http
                    .get(url_api + 'admin/user/' + id)
                    .then(function (data) {
                        $scope.selected_user = data.data.response[0];
                        $scope.data_nascimento_calendario = moment($scope.user.user_data_nascimento).format('YYYY-MM-DD');
                        if ($scope.selected_user.user_sexo_id == 1) {
                            $("#sexo_masculino").prop('checked', 'true');
                        } else if ($scope.selected_user.user_sexo_id == 2) {
                            $("#sexo_feminino").prop('checked', 'true');
                        }
                        $("#user_pais_id").val($scope.selected_user.user_pais_id);
                        $("#user_user_type_id").val($scope.selected_user.user_user_type_id);
                    });
            });
    };
});

app.controller('profileCtrl', function ($scope, $http) {
    $scope.loading = true;
    document.title = "Profile - FilmeRate";
    $scope.logout = function () {
        Cookies.remove('x-access-token');
        Cookies.remove('user_id');
        Cookies.remove('user_fullname');
        Cookies.remove('admin');
        window.location = "./";
    }

    $scope.changeDeleteId = function (id) {
        $scope.review_id = id;
    };

    $scope.apagarReview = function (id) {
        $http({
            method: 'POST',
            url: url_api + "user/review/delete",
            data: {
                filme_classificacao_id: id
            }
        }).then(function (data) {
            window.location = "./profile";
        });
    };

    $scope.openOptions = function (id) {
        var string_element = "#options-" + id;
        if ($(string_element).hasClass('show')) {
            $(string_element).removeClass('show');
        } else {
            $(string_element).addClass('show');
        }
    };

    $http
        .get(url_api + 'user/pais/list')
        .then(function (data) {
            $scope.pais = data.data.response;
            $http
                .get(url_api + "auth/me")
                .then(function (data) {
                    $scope.user = data.data.response;
                    $("#user_pais_id").val($scope.user.user_pais_id);
                    $scope.data_nascimento = moment().diff($scope.user.user_data_nascimento, 'years');
                    $scope.data_nascimento_calendario = moment($scope.user.user_data_nascimento).format('YYYY-MM-DD');
                    if ($scope.user.user_sexo_id == 1) {
                        $("#sexo_masculino").prop('checked', 'true');
                    } else if ($scope.user.user_sexo_id == 2) {
                        $("#sexo_feminino").prop('checked', 'true');
                    }
                    $http
                        .get(url_api + "user/reviews")
                        .then(function (data) {
                            $scope.review = data.data.response;
                            $scope.review_data = $scope.review.map(function (obj) {
                                return {
                                    data: moment(obj.filme_classificacao_data).calendar()
                                }
                            });
                            $scope.review_score = $scope.review.map(function (obj) {
                                return {
                                    likes: obj.likes,
                                    dislikes: obj.dislikes,
                                    liked: obj.liked,
                                    disliked: obj.disliked,
                                }
                            });
                            $scope.loading = false;
                            setTimeout(function () {
                                $scope.loadStars();
                            }, 100);
                        })
                });
        });

    $scope.likeReview = function (id, index) {
        $http({
            method: 'POST',
            url: url_api + "user/review/like",
            data: {
                filme_classificacao_id: id
            }
        }).then(function () {
            if ($scope.review_score[index].disliked == 1) {
                $scope.review_score[index].disliked = 0;
                $scope.review_score[index].dislikes -= 1;
            }
            $scope.review_score[index].liked = 1;
            $scope.review_score[index].likes += 1;
        }, function () {
            alert("error");
        });
    };

    $scope.dislikeReview = function (id, index) {
        $http({
            method: 'POST',
            url: url_api + "user/review/dislike",
            data: {
                filme_classificacao_id: id
            }
        }).then(function () {
            if ($scope.review_score[index].liked == 1) {
                $scope.review_score[index].liked = 0;
                $scope.review_score[index].likes -= 1;
            }
            $scope.review_score[index].disliked = 1;
            $scope.review_score[index].dislikes += 1;
        }, function () {
            alert("error");
        });
    };

    $scope.loadStars = function () {
        for (i = 0; i < $scope.review.length; i++) {
            var string_roteiro = "#roteiro-" + $scope.review[i].filme_classificacao_id;
            $(string_roteiro).starrr({
                max: 10,
                rating: $scope.review[i].filme_classificacao_roteiro,
                readOnly: true
            });
            var string_atores = "#atores-" + $scope.review[i].filme_classificacao_id;
            $(string_atores).starrr({
                max: 10,
                rating: $scope.review[i].filme_classificacao_atores,
                readOnly: true
            });
            var string_cenario = "#cenario-" + $scope.review[i].filme_classificacao_id;
            $(string_cenario).starrr({
                max: 10,
                rating: $scope.review[i].filme_classificacao_cenario,
                readOnly: true
            });
            var string_execucao = "#execucao-" + $scope.review[i].filme_classificacao_id;
            $(string_execucao).starrr({
                max: 10,
                rating: $scope.review[i].filme_classificacao_execucao,
                readOnly: true
            });
        }
    };

    $scope.guardarPerfil = function () {
        $http({
            method: 'POST',
            url: url_api + 'user/profile/edit',
            data: {
                user_firstname: $("#user_firstname").val(),
                user_lastname: $("#user_lastname").val(),
                user_data_nascimento: $("#user_data_nascimento").val(),
                user_bio: $("#user_bio").val(),
                user_sexo_id: $('input[name=user_sexo_id]:checked').val(),
                user_pais_id: $("#user_pais_id").val()
            }
        }).then(function (data) {
            // success
            $("#editarPerfilModal").modal('hide');
            $http
                .get(url_api + "auth/me")
                .then(function (data) {
                    $scope.user = data.data.response;
                    $scope.data_nascimento = moment().diff($scope.user.user_data_nascimento, 'years');
                    $scope.data_nascimento_calendario = moment($scope.user.user_data_nascimento).format('YYYY-MM-DD');
                    if ($scope.user.user_sexo_id == 1) {
                        $("#sexo_masculino").prop('checked', 'true');
                    } else if ($scope.user.user_sexo_id == 2) {
                        $("#sexo_feminino").prop('checked', 'true');
                    }
                });
        }, function (data) {
            // error
            $("#editarPerfilModal").modal('hide');
            $scope.error_message = "Erro ao atualizar o perfil";
        });
    };
});

app.controller('filmeCtrl', function ($scope, $http, $routeParams) {

    $scope.review_media = 0;

    $scope.review_roteiro = 0;
    $scope.review_atores = 0;
    $scope.review_cenario = 0;
    $scope.review_execucao = 0;

    $('.starrr').starrr({
        max: 10,
        change: function(e, value){
            if (e.target.id == "filmerate-user-review-roteiro") $scope.review_roteiro = value;
            else if (e.target.id == "filmerate-user-review-atores") $scope.review_atores = value;
            else if (e.target.id == "filmerate-user-review-cenario") $scope.review_cenario = value;
            else if (e.target.id == "filmerate-user-review-execucao") $scope.review_execucao = value;
            $scope.review_media = round(($scope.review_roteiro + $scope.review_atores + $scope.review_cenario + $scope.review_execucao) / 4, 0);
            $scope.$apply();
        }
    });

    $scope.insertReview = function () {
        if ($scope.titulo && $scope.corpo) {
            $scope.loading = true;
            $http({
                method: 'POST',
                url: url_api + 'user/review/add',
                data: {
                    filme_id: filme_id,
                    filme_classificacao_titulo: $scope.titulo,
                    filme_classificacao_corpo: $scope.corpo,
                    filme_classificacao_roteiro: $scope.review_roteiro,
                    filme_classificacao_atores: $scope.review_atores,
                    filme_classificacao_cenario: $scope.review_cenario,
                    filme_classificacao_execucao: $scope.review_execucao
                }
            }).then(function (data) {
                $scope.loading = false;
                window.location = "./filme?id=" + filme_id + "";
            }, function (data) {
                if (data.status == 400) {
                    $scope.error_message = "You already reviewed this movie.";
                    $scope.loading = false;
                } else if (data.status == 401) {
                    $scope.error_message = "You need to be logged in to perform this action.";
                    $scope.loading = false;
                }
            })
        }
    };

    var filme_id = $routeParams.id;

	if (Cookies.get('x-access-token')) {
        $scope.logged_in = true;
        var token = parseJwt(Cookies.get('x-access-token'));
        $scope.admin = token.user_type == 1 ? true : false;
    }
	else $scope.logged_in = false;

	if ($scope.logged_in == true) {
		$http
            ({
                method: 'POST',
                url: url_api + "user/myList/verify",
                data: { filme_id : filme_id }
            })
            .then(function (data) {
                if (data.data.response.watchlist == true) {
                    $scope.watchlist_add = false;
                } else {
                    $scope.watchlist_add = true;
                }
                $scope.loading = false;
            });
	}

    if ($scope.admin == true) {
        $http
            ({
                method: 'POST',
                url: url_api + "admin/filme/trending/check",
                data: { filme_id : filme_id }
            })
            .then(function (data) {
                if (data.data.response.trending == true) {
                    $scope.trending_add = false;
                } else {
                    $scope.trending_add = true;
                }
                $scope.loading = false;
            });
    }

	if (filme_id) {
        $scope.loading = true;
        $http
            .get(url_api + "filme/" + filme_id)
            .then(function (data) {
                $scope.filme = data.data.response;
                $scope.data_estreia = moment($scope.filme.filme_data_estreia).format('LL');
                document.title = $scope.filme.filme_title + " - FilmeRate";
                $http
                    .get(url_api + "filme/atores/" + filme_id)
                    .then(function (data) {
                        $scope.atores = data.data.response;
                        $http
                            .get(url_api + "filme/generos/" + filme_id)
                            .then(function (data) {
                                $scope.generos = data.data.response;
                            });

                        $http
                            .get(url_api + "filme/media/" + filme_id)
                            .then(function (data) {
                                $scope.filme_reviews_avg = data.data.response[0].filme_reviews_avg;
                                if ($scope.logged_in == false) {
                                    $http
                                        .get(url_api + "filme/reviews/" + filme_id)
                                        .then(function (data) {
                                            $scope.review = data.data.response;
                                            $scope.review_data = $scope.review.map(function (obj) {
                                                return {
                                                    data: moment(obj.filme_classificacao_data).calendar()
                                                }
                                            });
                                            $scope.review_score = $scope.review.map(function (obj) {
                                                return {
                                                    likes: obj.likes,
                                                    dislikes: obj.dislikes
                                                }
                                            });
                                            $scope.loading = false;
                                            setTimeout(function () {
                                                $scope.loadStars();
                                            }, 100);
                                        });
                                } else {
                                    $http
                                        .get(url_api + "user/filme/reviews/" + filme_id)
                                        .then(function (data) {
                                            $scope.review = data.data.response;
                                            $scope.review_data = $scope.review.map(function (obj) {
                                                return {
                                                    data: moment(obj.filme_classificacao_data).calendar()
                                                }
                                            });
                                            $scope.review_score = $scope.review.map(function (obj) {
                                                return {
                                                    likes: obj.likes,
                                                    dislikes: obj.dislikes,
                                                    liked: obj.liked,
                                                    disliked: obj.disliked,
                                                }
                                            });
                                            $scope.loading = false;
                                            setTimeout(function () {
                                                $scope.loadStars();
                                            }, 100);
                                        })
                                }
                            }, function (data) {
                                $scope.filme_reviews_avg = 0;
                                $scope.loading = false;
                            });
                    });
            });
    } else {
        $(".filmerate-review-card").remove();
		$("#filmerate-filme-card").html("<strong>Erro: </strong>Movie not found.");
		$("#filmerate-filme-card").addClass("p-2");
    }

	$scope.addWatchList = function() {
		$http
			({
                method: 'POST',
				url: url_api + "user/myList/add",
				data: { filme_id : filme_id }
			})
			.then(function (data) {
				$scope.watchlist_add = false;
			}, function (data) {
                if (data.status == 401) {
                    $scope.error_message = "You need to be logged in to perform this action.";
                }
            });
    };

    $scope.addTrending = function() {
		$http
			({
                method: 'POST',
				url: url_api + "admin/filme/trending/insert",
				data: { filme_id : filme_id }
			})
			.then(function (data) {
				$scope.trending_add = false;
			});
    };

    $scope.deleteWatchList = function() {
		$http
			({
                method: 'POST',
				url: url_api + "user/myList/delete",
                data: { filme_id : filme_id }
			})
			.then(function (data) {
				$scope.watchlist_add = true;
			});
    };

    $scope.deleteTrending = function() {
    	$http
    		({
                method: 'POST',
    			url: url_api + "admin/filme/trending/remove",
                data: { filme_id : filme_id }
    		})
    		.then(function (data) {
    			$scope.trending_add = true;
    		});
    };

    $scope.loadStars = function () {
        for (i = 0; i < $scope.review.length; i++) {
            var string_roteiro = "#roteiro-" + $scope.review[i].filme_classificacao_id;
            $(string_roteiro).starrr({
                max: 10,
                rating: $scope.review[i].filme_classificacao_roteiro,
                readOnly: true
            });
            var string_atores = "#atores-" + $scope.review[i].filme_classificacao_id;
            $(string_atores).starrr({
                max: 10,
                rating: $scope.review[i].filme_classificacao_atores,
                readOnly: true
            });
            var string_cenario = "#cenario-" + $scope.review[i].filme_classificacao_id;
            $(string_cenario).starrr({
                max: 10,
                rating: $scope.review[i].filme_classificacao_cenario,
                readOnly: true
            });
            var string_execucao = "#execucao-" + $scope.review[i].filme_classificacao_id;
            $(string_execucao).starrr({
                max: 10,
                rating: $scope.review[i].filme_classificacao_execucao,
                readOnly: true
            });
        }
    };

    $scope.likeReview = function (id, index) {
        $http({
            method: 'POST',
            url: url_api + "user/review/like",
            data: {
                filme_classificacao_id: id
            }
        }).then(function () {
            if ($scope.review_score[index].disliked == 1) {
                $scope.review_score[index].disliked = 0;
                $scope.review_score[index].dislikes -= 1;
            }
            $scope.review_score[index].liked = 1;
            $scope.review_score[index].likes += 1;
        }, function () {
            alert("error");
        });
    };

    $scope.dislikeReview = function (id, index) {
        $http({
            method: 'POST',
            url: url_api + "user/review/dislike",
            data: {
                filme_classificacao_id: id
            }
        }).then(function () {
            if ($scope.review_score[index].liked == 1) {
                $scope.review_score[index].liked = 0;
                $scope.review_score[index].likes -= 1;
            }
            $scope.review_score[index].disliked = 1;
            $scope.review_score[index].dislikes += 1;
        }, function () {
            alert("error");
        });
    };
});

app.controller('atorCtrl', function ($scope, $http) {
    var ator_id = urlParam('id');

    if (ator_id) {
        $scope.loading = true;
        $http
            .get(url_api + "ator/" + ator_id)
            .then(function (data) {
                $scope.ator = data.data.response;
                document.title = $scope.ator.ator_nome + " - FilmeRate";
                $http
                    .get(url_api + 'ator/' + ator_id + '/filmes')
                    .then(function (data) {
                        $scope.filmes = data.data.response
                        $scope.loading = false;
                    })
            });
    } else {
		$("#filmerate-filme-card").html("<strong>Erro: </strong>Actor not found.");
		$("#filmerate-filme-card").addClass("p-2");
    }
});

app.controller('realizadorCtrl', function ($scope, $http) {
    var realizador_id = urlParam('id');

    if (realizador_id) {
        $scope.loading = true;
        $http
            .get(url_api + "realizador/" + realizador_id)
            .then(function (data) {
                $scope.realizador = data.data.response;
                document.title = $scope.realizador.realizador_nome + " - FilmeRate";
                $http
                    .get(url_api + 'realizador/' + realizador_id + '/filmes')
                    .then(function (data) {
                        $scope.filmes = data.data.response
                        $scope.loading = false;
                    })
            });
    } else {
		$("#filmerate-filme-card").html("<strong>Erro: </strong>Director not found.");
		$("#filmerate-filme-card").addClass("p-2");
    }
});

app.controller('watchlistCtrl', function ($scope, $http) {
    document.title = "Watchlist - FilmeRate";
	$scope.loading = true;

    $http
        .get(url_api + "user/myList")
        .then(function (data) {
            $scope.filmes = data.data.response;
			$scope.loading = false;
        }, function (data) {
            $scope.error_message = "You don't have movies on your watchlist.";
            $scope.loading = false;
        });

	$scope.deleteWatchList = function (filme_id) {
        $http({
                method: 'POST',
                url: url_api + "user/myList/delete",
                data: { filme_id : filme_id }
            })
            .then(function (data) {
                $http
                    .get(url_api + "user/myList")
                    .then(function (data) {
                        $scope.filmes = data.data.response;
                    }, function (data) {
                        $scope.error_message = "You don't have movies on your watchlist.";
                        $scope.loading = false;
                    });
            }, function (data) {
                alert("not apagado");
            });
	};
});

app.controller('filmeEditCtrl', function ($scope, $http) {
    $scope.loading = true;
    document.title = "Edit mode - FilmeRate";

    var filme_id = urlParam('id');
    var admin = Cookies.get('admin');

    $scope.saveChanges = function () {
        $http({
            method: 'POST',
            url: url_api + "admin/filme/edit",
            data: {
                filme_id: filme_id,
                filme_title: $scope.filme_title,
                filme_sinopse: $scope.filme_sinopse,
                filme_data_estreia: $scope.filme_data_estreia,
                filme_duracao: $scope.filme_duracao,
                filme_poster: $scope.filme_poster
            }
        }).then(function (data) {
            window.history.back();
        }, function (data) {
            $scope.error_message = "We couldn't save your changes.";
        });
    };

    if (admin == "true") {
        if (filme_id) {
            $scope.loading = true;
            $http
                .get(url_api + "filme/" + filme_id)
                .then(function (data) {
                    var filme = data.data.response;
                    $scope.filme_title = filme.filme_title;
                    $scope.filme_sinopse = filme.filme_sinopse;
                    $scope.filme_duracao = parseInt(filme.filme_duracao);
                    $scope.filme_poster = filme.filme_poster;
                    $scope.data_estreia = moment(filme.filme_data_estreia).format('YYYY-MM-DD');
                    $scope.loading = false;
                });
        } else {
            $(".filmerate-review-card").remove();
            $("#filmerate-filme-card").html("<strong>Erro: </strong>Movies not found.");
            $("#filmerate-filme-card").addClass("p-2");
        }
    } else {
        $(".filmerate-review-card").remove();
		$("#filmerate-filme-card").html("<strong>Erro: </strong>You don't have the right permissions to access this page.");
		$("#filmerate-filme-card").addClass("p-2");
    }
});

app.controller('privacyCtrl', function ($scope, $http) {
    $scope.loading = true;
    document.title = "Privacy settings - FilmeRate";

    $http
        .get(url_api + "auth/me")
        .then(function (data) {
            var privacy = data.data.response.user_privacy;
            var string_radio = "privacy_" + privacy;
            var radio = document.getElementById(string_radio);
            radio.checked = true;
            $scope.loading = false;
        }, function () {
            $scope.loading = false;
            $scope.error_message = "An error occured while trying to load your privacy settings."
        });

    $scope.changePrivacy = function () {
        if ($scope.privacy) {
            $http({
                method: 'POST',
                url: url_api + "user/privacy/change",
                data: {
                    user_privacy: $scope.privacy
                }
            }).then(function () {
                window.history.back();
            }, function () {
                alert("error");
            });
        } else {
            window.history.back();
        }
    };
});

app.controller('userCtrl', function ($scope, $http, $routeParams) {
    $scope.loading = true;

    if (Cookies.get('x-access-token')) {
        $scope.logged_in = true;
        var token = parseJwt(Cookies.get('x-access-token'));
        $scope.admin = token.user_type == 1 ? true : false;
        $scope.user_id = token.id;
    }
	else $scope.logged_in = false;

    $scope.likeReview = function (id, index) {
        $http({
            method: 'POST',
            url: url_api + "user/review/like",
            data: {
                filme_classificacao_id: id
            }
        }).then(function () {
            if ($scope.review_score[index].disliked == 1) {
                $scope.review_score[index].disliked = 0;
                $scope.review_score[index].dislikes -= 1;
            }
            $scope.review_score[index].liked = 1;
            $scope.review_score[index].likes += 1;
        }, function () {
            alert("error");
        });
    };

    $scope.dislikeReview = function (id, index) {
        $http({
            method: 'POST',
            url: url_api + "user/review/dislike",
            data: {
                filme_classificacao_id: id
            }
        }).then(function () {
            if ($scope.review_score[index].liked == 1) {
                $scope.review_score[index].liked = 0;
                $scope.review_score[index].likes -= 1;
            }
            $scope.review_score[index].disliked = 1;
            $scope.review_score[index].dislikes += 1;
        }, function () {
            alert("error");
        });
    };

    $scope.loadStars = function () {
        for (i = 0; i < $scope.review.length; i++) {
            var string_roteiro = "#roteiro-" + $scope.review[i].filme_classificacao_id;
            $(string_roteiro).starrr({
                max: 10,
                rating: $scope.review[i].filme_classificacao_roteiro,
                readOnly: true
            });
            var string_atores = "#atores-" + $scope.review[i].filme_classificacao_id;
            $(string_atores).starrr({
                max: 10,
                rating: $scope.review[i].filme_classificacao_atores,
                readOnly: true
            });
            var string_cenario = "#cenario-" + $scope.review[i].filme_classificacao_id;
            $(string_cenario).starrr({
                max: 10,
                rating: $scope.review[i].filme_classificacao_cenario,
                readOnly: true
            });
            var string_execucao = "#execucao-" + $scope.review[i].filme_classificacao_id;
            $(string_execucao).starrr({
                max: 10,
                rating: $scope.review[i].filme_classificacao_execucao,
                readOnly: true
            });
        }
    };

    $http
        .get(url_api + 'users/' + $routeParams.id)
        .then(function (data) {
            $scope.user = data.data.response;
            $scope.data_nascimento = moment().diff($scope.user.user_data_nascimento, 'years');
            document.title = $scope.user.user_firstname + " " + $scope.user.user_lastname + " - FilmeRate";

            if ($scope.logged_in == false) {
                $http
                    .get(url_api + 'users/' + $routeParams.id + '/reviews')
                    .then(function (data) {
                        $scope.review = data.data.response;
                        $scope.review_data = $scope.review.map(function (obj) {
                            return {
                                data: moment(obj.filme_classificacao_data).calendar()
                            }
                        });
                        $scope.review_score = $scope.review.map(function (obj) {
                            return {
                                likes: obj.likes,
                                dislikes: obj.dislikes,
                                liked: obj.liked,
                                disliked: obj.disliked,
                            }
                        });
                        $scope.loading = false;
                        setTimeout(function () {
                            $scope.loadStars();
                        }, 100);
                    })
            } else {
                $http
                    .get(url_api + 'user/reviews/users/' + $routeParams.id)
                    .then(function (data) {
                        $scope.review = data.data.response;
                        $scope.review_data = $scope.review.map(function (obj) {
                            return {
                                data: moment(obj.filme_classificacao_data).calendar()
                            }
                        });
                        $scope.review_score = $scope.review.map(function (obj) {
                            return {
                                likes: obj.likes,
                                dislikes: obj.dislikes,
                                liked: obj.liked,
                                disliked: obj.disliked,
                            }
                        });
                        $scope.loading = false;
                        setTimeout(function () {
                            $scope.loadStars();
                        }, 100);
                    })
            }
        }, function (data) {
            $scope.error_message = data.data.response
            $scope.loading = false;
        })
});
