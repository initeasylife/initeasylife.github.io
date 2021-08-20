---
layout: post
title:  "Pearson correlation coefficient"
date:   2018-06-29 09:47:50 +0800
categories: jekyll update
---
<script type="text/javascript" async src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-MML-AM_CHTML"> </script>
# 定义
$$Pearson = \frac{Cov(X,Y)}{\sigma_X\sigma_Y} = \frac{E[(X-\bar X)(Y-\bar Y)]}{\sigma_X\sigma_Y}=\frac{\sum(x_i-\bar x)(y_i-\bar y)}{\sqrt{\sum(x_i-\bar x)^2\sum(y_i-\bar y)^2}}$$


$$Cosine = \frac{X\cdot Y}{\lVert X \rVert \lVert Y \rVert}=\frac{\sum x_iy_i}{\sqrt{\sum x_i^2 \sum y_i^2}}$$



$$Euclidean = \sqrt{\sum(x_i-y_i)^2} $$


由公式可得

1. 当X和Y的期望为0时，Pearson和Cosine等价。Pearson就是中心化后的Cosine。

2. 如果X已经标准化，那么
$$\sum X_i^2 = \sum (X_i-\mu_X)^2=(n-1)\sigma_X=n-1$$
当n取值很大时，$n-1\rightarrow n$，故
$\sum X_i^2=n$

此时$$d^2(X,Y)=\sum(x_i-y_i)^2=\sum x_i^2 -2\sum x_iy_i+\sum y_i^2$$
$$=2n-2\sum x_iy_i=2n(1-\frac{\sum x_iy_i}{n})$$
$$=2n(1-pearson)$$

故当X和Y期望为0，标准差为1时，欧氏距离和pearson等价