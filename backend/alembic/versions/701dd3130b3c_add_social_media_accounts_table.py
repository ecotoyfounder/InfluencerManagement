"""Add social_media_accounts table

Revision ID: 701dd3130b3c
Revises: 4b6f9b1f9be6
Create Date: 2024-12-13 12:22:44.659894

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '701dd3130b3c'
down_revision: Union[str, None] = '4b6f9b1f9be6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('social_media_accounts',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('platform', sa.String(length=50), nullable=False),
    sa.Column('username', sa.String(length=50), nullable=False),
    sa.Column('influencer_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['influencer_id'], ['influencers.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_social_media_accounts_id'), 'social_media_accounts', ['id'], unique=False)
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_social_media_accounts_id'), table_name='social_media_accounts')
    op.drop_table('social_media_accounts')
    # ### end Alembic commands ###