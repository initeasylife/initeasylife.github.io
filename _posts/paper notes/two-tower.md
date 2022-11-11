two tower


in-batch negatives

we show that the proposed algorithm
can work without requiring fixed item vocabulary, and is capable of
producing unbiased estimation and being adaptive to item distribution change. 


large variance for long-tail content

 Facing the well-reported cold-start problem,
real-world systems need to be adaptive to data distribution change
to better surface fresh content.



MLP model is commonly trained with many sampled negatives from a fixed vocabulary of items. In contrast, with deep item
tower, it is typically inefficient to sample and train on many negatives due to item content features and shared network parameters
for computing all item embeddings



neural collaborative filtering


Hash buckets


how embedding

y. In addition, a temperature τ is added
to each logit to sharpen the predictions, namely,
s(x,y) = ⟨u(x, θ),v(y, θ)⟩/τ .
In practice τ is a hyper-parameter tuned to maximize retrieval
metrics such as recall or precision.

# BackGround
Sampling-Bias-Corrected Neural Modeling for Large Corpus
Item Recommendations


2019年Google发表，目前NH的主力模型


# ABSTRACT
一般来讲，数据是非常稀疏的，label是服从指数分布族的。本文提出一种新的双塔网络结构

