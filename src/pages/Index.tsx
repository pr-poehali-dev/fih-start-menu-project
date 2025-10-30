import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';

const tiles = [
  { id: 'feed', icon: 'Rss', label: 'Лента', color: 'bg-primary', size: 'large' },
  { id: 'friends', icon: 'Users', label: 'Друзья', color: 'bg-secondary', size: 'small' },
  { id: 'messages', icon: 'MessageCircle', label: 'Сообщения', color: 'bg-accent', size: 'small' },
  { id: 'groups', icon: 'UsersRound', label: 'Группы', color: 'bg-primary', size: 'small' },
  { id: 'media', icon: 'Image', label: 'Медиа', color: 'bg-secondary', size: 'small' },
  { id: 'settings', icon: 'Settings', label: 'Настройки', color: 'bg-muted', size: 'small' },
  { id: 'profile', icon: 'User', label: 'Профиль', color: 'bg-accent', size: 'large' },
];

const mockPosts = [
  {
    id: 1,
    author: 'Анна Смирнова',
    avatar: 'АС',
    time: '2 часа назад',
    content: 'Отличная погода сегодня! Решила прогуляться по парку 🌳',
    likes: 24,
    comments: 5,
  },
  {
    id: 2,
    author: 'Дмитрий Петров',
    avatar: 'ДП',
    time: '5 часов назад',
    content: 'Запустил новый проект! Очень рад поделиться с вами 🚀',
    likes: 42,
    comments: 12,
  },
  {
    id: 3,
    author: 'Елена Иванова',
    avatar: 'ЕИ',
    time: '8 часов назад',
    content: 'Кто-нибудь был на концерте вчера? Впечатления просто невероятные! 🎵',
    likes: 18,
    comments: 8,
  },
];

export default function Index() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [newPost, setNewPost] = useState('');
  const [posts, setPosts] = useState(mockPosts);

  const handleTileClick = (tileId: string) => {
    setActiveSection(tileId === activeSection ? null : tileId);
  };

  const handlePostSubmit = () => {
    if (newPost.trim()) {
      const post = {
        id: posts.length + 1,
        author: 'Вы',
        avatar: 'ВЫ',
        time: 'только что',
        content: newPost,
        likes: 0,
        comments: 0,
      };
      setPosts([post, ...posts]);
      setNewPost('');
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="text-4xl font-bold text-primary">FIH</div>
          <div className="flex-1" />
          <Button variant="ghost" size="icon">
            <Icon name="Search" size={24} />
          </Button>
          <Button variant="ghost" size="icon">
            <Icon name="Bell" size={24} />
          </Button>
          <Avatar>
            <AvatarFallback className="bg-secondary">ВЫ</AvatarFallback>
          </Avatar>
        </div>

        {!activeSection && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[180px]">
            {tiles.map((tile) => (
              <Card
                key={tile.id}
                className={`${tile.color} ${
                  tile.size === 'large' ? 'col-span-2 row-span-2' : ''
                } tile-flip cursor-pointer flex flex-col items-center justify-center gap-4 border-0 hover:shadow-2xl transition-all duration-300`}
                onClick={() => handleTileClick(tile.id)}
              >
                <Icon name={tile.icon as any} size={tile.size === 'large' ? 64 : 48} className="text-white" />
                <span className="text-xl md:text-2xl font-medium text-white">{tile.label}</span>
              </Card>
            ))}
          </div>
        )}

        {activeSection === 'feed' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-4 mb-6">
              <Button variant="ghost" size="icon" onClick={() => setActiveSection(null)}>
                <Icon name="ArrowLeft" size={24} />
              </Button>
              <h1 className="text-3xl font-bold">Лента новостей</h1>
            </div>

            <Card className="p-6 mb-6">
              <div className="flex gap-4">
                <Avatar>
                  <AvatarFallback className="bg-secondary">ВЫ</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea
                    placeholder="Что у вас нового?"
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    className="mb-3 resize-none"
                    rows={3}
                  />
                  <Button onClick={handlePostSubmit} className="bg-primary hover:bg-primary/90">
                    <Icon name="Send" size={18} className="mr-2" />
                    Опубликовать
                  </Button>
                </div>
              </div>
            </Card>

            <div className="space-y-4">
              {posts.map((post) => (
                <Card key={post.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex gap-4 mb-4">
                    <Avatar>
                      <AvatarFallback className="bg-secondary">{post.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-semibold">{post.author}</div>
                      <div className="text-sm text-muted-foreground">{post.time}</div>
                    </div>
                  </div>
                  <p className="mb-4">{post.content}</p>
                  <div className="flex gap-6 text-muted-foreground">
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Icon name="Heart" size={18} />
                      {post.likes}
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Icon name="MessageCircle" size={18} />
                      {post.comments}
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Icon name="Share2" size={18} />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeSection && activeSection !== 'feed' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-4 mb-6">
              <Button variant="ghost" size="icon" onClick={() => setActiveSection(null)}>
                <Icon name="ArrowLeft" size={24} />
              </Button>
              <h1 className="text-3xl font-bold">
                {tiles.find((t) => t.id === activeSection)?.label}
              </h1>
            </div>
            <Card className="p-12 text-center">
              <Icon
                name={tiles.find((t) => t.id === activeSection)?.icon as any}
                size={64}
                className="mx-auto mb-4 text-muted-foreground"
              />
              <p className="text-xl text-muted-foreground">Раздел в разработке</p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
