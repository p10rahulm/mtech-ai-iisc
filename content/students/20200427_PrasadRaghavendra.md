+++
title = "List-Decodable Learning via Sum of Squares"
author = "<a href="https://people.eecs.berkeley.edu/~prasad/" target="_blank">Prasad Raghavendra, UC Berkeley</a>"
date = "2020-04-27T21:00:00+05:30"
date_end = "2020-04-27T22:00:00+05:30"
location = "<a href="https://bluejeans.com/913829514" target="_blank">Location: Virtual Seminar</a>"
notes = "Notes: Joint seminar with <a target="_blank" href="https://arc.gatech.edu/hg/item/634657">Algorithms and Randomness Center, Georgia Tech</a>"
link_to_paper = ""
/*link_to_recording = '''This is a test
    multiline
    comment'''
*/
+++

<b>Abstract:</b> In the list-decodable learning setup, an overwhelming majority (say a $1-\beta$ fraction) of the input
data consists of outliers and the goal of an algorithm is to output a small list $\mathcal{L}$ of hypotheses such that
one of them agrees with inliers.   We devise list decodable learning algorithms for the problem of linear regression and
subspace recovery using the sum of squares SDP hierarchy.
<br><br>
1)  In the list-decodable linear regression problem, we are given labelled examples $\{(X_i,y_i)\}_{i \in [N]}$
containing a subset $S$ of $\beta N$ {\it inliers} $\{X_i \}_{i \in S}$ that are drawn i.i.d. from standard Gaussian
distribution $N(0,I)$ in $\mathbb{R}^d$, where the corresponding labels $y_i$ are well-approximated by a linear
function $\hat{\ell}$.
<br>
We devise an algorithm that outputs a list $\mathcal{L}$ of linear functions such that there exists some
$\ell \in \mathcal{L}$ that is close to $\hat{\ell}$.     This yields the first algorithm for linear regression in a
list-decodable setting.  Our results hold for a general distribution of examples whose concentration and
anti-concentration properties can be certified by low degree sum-of-squares proofs.
<br><br>
2) In the subspace recovery problem,  given a dataset where an $\alpha$ fraction (less than half) of the data is
distributed uniformly in an unknown $k$ dimensional subspace in $d$ dimensions, and with no additional assumptions
on the remaining data, the goal is to recover a succinct list of $O(\frac{1}{\alpha})$ subspaces one of which is
close to the original subspace.  We provide the first polynomial time algorithm for the 'list decodable subspace
recovery' problem.
<br><br>
Joint work with Morris Yau.