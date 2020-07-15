---
layout: post
title:  "Lagrange Duality"
date:   2018-06-29 09:47:50 +0800
categories: jekyll update
---
<script type="text/javascript" async src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-MML-AM_CHTML"> </script>

# Lagrange Duality

$$\min_{x}\ \ f(x) \tag{1}$$


$$s.t. \ \ \ g_i(x)\leq0\ ,\ \ i\in \\{ 1,\ldots,m\\}  \tag{2}$$


$$h_i(x)=0,\ \ i\in \\{1,\ldots,p\\}\tag{3}$$

### Generalized Lagrange Function:
$$L(x,\alpha,\beta)=f(x)+\sum_{i=1}^{m}\alpha _i g _i(x) + \sum _{i=1}^p \beta _i h _i(x)\tag{4}$$


$$\theta_{p}(x) = \max _{ \alpha,\beta ;\alpha _i\geq0}L(x,\alpha,\beta)=f(x)\tag{5}$$


$$p^*=\min_x \theta _p(x)\tag{6}$$


### Duality Problem:


$$\theta _D(\alpha,\beta)=\min _x L(x,\alpha,\beta)\tag{7}$$


$$d^*=\max _{\alpha,\beta ;\alpha _i \geq0}\theta _D(\alpha,\beta)\tag{8}$$


### KKT Conditions:

\\(\alpha^ *,\beta^ *\\)为对偶问题的解，$x^ *$为原问题的解，则：


$$\forall\ \ \alpha \geq 0,\beta\ \tag{9}$$


$$p ^* = f(x^*)\geq f (x^{ *})+\sum_{i=1}^{m}\alpha _i^ * g _i(x^ *) + \sum _{i=1}^p \beta _i^ * h _i(x^ *) \tag{10}$$


$$=L(x^ *,\alpha^ *,\beta^ *)\tag{11}$$


$$\geq\min_x L(x,\alpha^ *,\beta^ *)\tag{12}$$


$$=\theta_D(\alpha^ *,\beta^ *)=d^ *\tag{13}$$


由公式（9）可得：\\(p^* \geq d^*\tag{14}\\)


如果（10）等号成立，可得：


$$\alpha _i^ * g _i(x^ *)=0\tag{15}$$


$$g _i(x^ *)\leq0\tag{16}$$


$$\alpha _i^ *\geq0\tag{17}$$


$$h _i(x^ *)=0\tag{18}$$


如果（12）等号成立，可得：


$$\nabla_x L(x^ *,\alpha^ *,\beta^ *)=0\tag{19}$$


$$\nabla_\alpha L(x^ *,\alpha^ *,\beta^\ )=0\tag{20}$$


$$\nabla_\beta L(x^ *,\alpha^ *,\beta^ *)=0\tag{21}$$


公式（15-21）即为KKT Conditions


假设\\(f(x),g_i(x)\\)是凸函数（Convex），\\( h _i(x)\\)是仿射函数，且不等式约束\\(g _i(x)\\)是严格可行的，则\\(x^ *,\alpha^ *,\beta^ *\\)分别为原问题和对偶问题解的充要条件即为上述KKT Conditions。




