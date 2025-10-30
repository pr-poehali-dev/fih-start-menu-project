import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { authService, postsService, User, Post } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

const tiles = [
  { id: 'feed', icon: 'Rss', label: 'Лента', color: 'bg-primary', size: 'large' },
  { id: 'friends', icon: 'Users', label: 'Друзья', color: 'bg-secondary', size: 'small' },
  { id: 'messages', icon: 'MessageCircle', label: 'Сообщения', color: 'bg-accent', size: 'small' },
  { id: 'groups', icon: 'UsersRound', label: 'Группы', color: 'bg-primary', size: 'small' },
  { id: 'media', icon: 'Image', label: 'Медиа', color: 'bg-secondary', size: 'small' },
  { id: 'settings', icon: 'Settings', label: 'Настройки', color: 'bg-muted', size: 'small' },
  { id: 'profile', icon: 'User', label: 'Профиль', color: 'bg-accent', size: 'large' },
];

export default function Index() {
  const [user, setUser] = useState<User | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [newPost, setNewPost] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    full_name: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    const { user: savedUser } = authService.getAuth();
    if (savedUser) {
      setUser(savedUser);
      loadPosts();
    }
  }, []);

  const loadPosts = async () => {
    try {
      const data = await postsService.getPosts();
      setPosts(data);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить посты',
        variant: 'destructive',
      });
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let response;
      if (isLogin) {
        response = await authService.login(formData.username, formData.password);
      } else {
        response = await authService.register(
          formData.username,
          formData.email,
          formData.password,
          formData.full_name
        );
      }
      authService.saveAuth(response.user, response.token);
      setUser(response.user);
      await loadPosts();
      toast({
        title: 'Успешно!',
        description: isLogin ? 'Вы вошли в систему' : 'Регистрация завершена',
      });
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setPosts([]);
    setActiveSection(null);
  };

  const handleTileClick = (tileId: string) => {
    setActiveSection(tileId === activeSection ? null : tileId);
  };

  const handlePostSubmit = async () => {
    if (newPost.trim() && user) {
      try {
        await postsService.createPost(user.id, newPost);
        setNewPost('');
        await loadPosts();
        toast({
          title: 'Готово!',
          description: 'Пост опубликован',
        });
      } catch (error: any) {
        toast({
          title: 'Ошибка',
          description: error.message,
          variant: 'destructive',
        });
      }
    }
  };

  const handleLike = async (postId: number) => {
    try {
      await postsService.likePost(postId);
      await loadPosts();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось поставить лайк',
        variant: 'destructive',
      });
    }
  };

  const getTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays} дн. назад`;
    if (diffHours > 0) return `${diffHours} ч. назад`;
    if (diffMins > 0) return `${diffMins} мин. назад`;
    return 'только что';
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary mb-2">FIH</h1>
            <p className="text-muted-foreground">Социальная сеть</p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <Label htmlFor="username">Имя пользователя</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
              />
            </div>

            {!isLogin && (
              <>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="full_name">Полное имя</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    required
                  />
                </div>
              </>
            )}

            <div>
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
              {isLogin ? 'Войти' : 'Зарегистрироваться'}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              {isLogin ? 'Нет аккаунта? Зарегистрируйтесь' : 'Уже есть аккаунт? Войдите'}
            </button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="text-4xl font-bold text-primary">FIH</div>
          {user.is_creator && (
            <span className="px-3 py-1 bg-secondary text-secondary-foreground text-sm rounded-full font-medium">
              Создатель
            </span>
          )}
          <div className="flex-1" />
          <Button variant="ghost" size="icon">
            <Icon name="Search" size={24} />
          </Button>
          <Button variant="ghost" size="icon">
            <Icon name="Bell" size={24} />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <Icon name="LogOut" size={24} />
          </Button>
          <Avatar className="cursor-pointer">
            <AvatarFallback className="bg-secondary">{user.avatar}</AvatarFallback>
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
                  <AvatarFallback className="bg-secondary">{user.avatar}</AvatarFallback>
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
                      <div className="flex items-center gap-2">
                        <div className="font-semibold">{post.full_name || post.username}</div>
                        {post.is_creator && (
                          <span className="px-2 py-0.5 bg-secondary text-secondary-foreground text-xs rounded-full">
                            Создатель
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">{getTimeAgo(post.created_at)}</div>
                    </div>
                  </div>
                  <p className="mb-4">{post.content}</p>
                  <div className="flex gap-6 text-muted-foreground">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-2"
                      onClick={() => handleLike(post.id)}
                    >
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
