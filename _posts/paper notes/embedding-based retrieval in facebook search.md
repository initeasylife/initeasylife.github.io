LOSS
文中使用了Pairwise Hinge Loss的形式，$loss=max(0,margin-<u,d_+>+<u,d_->)$。即同一个用户与“正文章”（点击过的文章）的匹配度<$u,d_+$>，要比用户与“负文章”（怎么选择负文章就是召回的关键）的匹配度<$u,d_-$>高于一定的阈值
尽管不同召回算法有不同的loss，但是背后基于Pairwise LTR的思想都是共通，这一点与排序时采用binary cross entropy loss有较大的不同。
比如Youtube/DSSM模型使用(Sampled) Softmax。但经过Negative Sampling之后，同样是针对同一个用户，一个$d_+$要配置若干个$d_-$，与Pairwise思路类似
而想让u在$d_+$上的得分最高，同样要求分子$<u,d_+>$尽可能大，而分母所有的$<u,d_->$尽可能小，与LTR的思路类似。
但是，根据我的实践经验，使用BPR loss=$log(1+exp(<u,d_->-<u,d_+>))$，效果要比这里的Pairwise Hinge Loss好
文中也说了margin对于模型效果影响巨大，BPR loss少了一个需要调整的超参
Hinge loss中，$<u,d_+>-<u,d_->$大于margin后，对于loss的贡献减少为0。而BPR则没有针对$<u,d_+>-<u,d_->$设定上限，鼓励优势越大越好。




$$ P(X) = \prod_{j=1}^p P(X_j\mid\text{pa}_j). $$



$$ \begin{aligned} P(X) &= P(X_1) \cdot P(X_2) \cdot P(X_3\mid X_1,X_2) \cdot P(X_4\mid X_1) \\ & \cdot P(X_5\mid X_1,X_4) \cdot P(X_6\mid X_5) \cdot P(X_7\mid X_2, X_4, X_6). \end{aligned} $$