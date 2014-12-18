
#!/bin/sh

# See instructions here:
# https://help.github.com/articles/changing-author-info/

# 1. Open Git shell
# 2. Goto repo
# 3. Run this script ./cmd.sh
# 4. View changes with 'git log'
# 5. Run 'git push --force --tags origin 'refs/heads/*' to commit new logs

git filter-branch --env-filter '

OLD_EMAIL="email_of_user_to_change"
CORRECT_NAME="anonymous"
CORRECT_EMAIL="rama@rchoetzlein.com"

if [ "$GIT_COMMITTER_EMAIL" = "$OLD_EMAIL" ]
then
    export GIT_COMMITTER_NAME="$CORRECT_NAME"
    export GIT_COMMITTER_EMAIL="$CORRECT_EMAIL"
fi
if [ "$GIT_AUTHOR_EMAIL" = "$OLD_EMAIL" ]
then
    export GIT_AUTHOR_NAME="$CORRECT_NAME"
    export GIT_AUTHOR_EMAIL="$CORRECT_EMAIL"
fi
' --tag-name-filter cat -- --branches --tags

